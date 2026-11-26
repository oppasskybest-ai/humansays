/**
 * config.ts: the ONLY place that reads environment variables or feature flags.
 * Spec rule: "Read flags only from src/lib/config.ts, never directly from process.env elsewhere."
 *
 *  - publicConfig       : safe for the browser (NEXT_PUBLIC_* only)
 *  - getServerConfig()  : server only. Validates with zod and FAILS LOUDLY if something is missing.
 *                         Call it inside route handlers/server code, never in client components.
 *
 * Owner: Opeyemi (L0).
 */
import { z } from 'zod';

export const PI_API_BASE = 'https://api.minepi.com/v2';

const bool = z.enum(['true', 'false']).transform((v) => v === 'true');
const stroops = z.string().regex(/^\d+$/, 'must be a whole number of stroops').transform((v) => BigInt(v));

/* ------------------------------ public (browser-safe) ------------------------------ */

// NOTE: Next.js only inlines NEXT_PUBLIC_* when written out literally like below.
const publicSchema = z.object({
  NEXT_PUBLIC_PI_SANDBOX: bool.default('true'),
  NEXT_PUBLIC_STROOPS_PER_POINT: z.coerce.number().int().positive().default(10_000),
});

export const publicConfig = (() => {
  const v = publicSchema.parse({
    NEXT_PUBLIC_PI_SANDBOX: process.env.NEXT_PUBLIC_PI_SANDBOX,
    NEXT_PUBLIC_STROOPS_PER_POINT: process.env.NEXT_PUBLIC_STROOPS_PER_POINT,
  });
  return { sandbox: v.NEXT_PUBLIC_PI_SANDBOX, stroopsPerPoint: v.NEXT_PUBLIC_STROOPS_PER_POINT };
})();

/* ------------------------------------ server ------------------------------------ */

const serverSchema = z
  .object({
    PI_ENV: z.enum(['staging', 'production']),
    PI_API_KEY: z.string().min(1),
    PI_WALLET_SEED: z.string().optional(),
    FUNDING_MODE: z.enum(['pi', 'credits_only']).default('credits_only'),
    PAYOUT_MODE: z.enum(['points', 'pi_a2u']).default('points'),
    PLATFORM_FEE_BPS: z.coerce.number().int().min(0).max(5000).default(1000),
    MIN_REWARD_STROOPS: stroops.default('10000'),
    MIN_WITHDRAW_STROOPS: stroops.default('1000000'),
    MAX_RESPONSES_PER_DAY: z.coerce.number().int().positive().default(20),
    MODERATION_REQUIRED: bool.default('true'),
    SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be 32+ characters'),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    ANTHROPIC_API_KEY: z.string().optional(),
    ANTHROPIC_MODEL: z.string().optional(),
    AI_DAILY_CAP_PER_USER: z.coerce.number().int().nonnegative().default(20),
    ADMIN_UIDS: z.string().default(''),
    CRON_SECRET: z.string().min(16, 'CRON_SECRET must be 16+ characters'),
    APP_BASE_URL: z.string().url().default('http://localhost:3000'),
  })
  .superRefine((v, ctx) => {
    if (v.PAYOUT_MODE === 'pi_a2u' && !v.PI_WALLET_SEED) {
      ctx.addIssue({ code: 'custom', path: ['PI_WALLET_SEED'], message: 'required when PAYOUT_MODE=pi_a2u' });
    }
  });

let cached: ReturnType<typeof build> | null = null;

function build() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}\n(see .env.example)`);
  }
  const e = parsed.data;
  return {
    piEnv: e.PI_ENV,
    isTestMode: e.PI_ENV === 'staging', // show the "Test mode: Test Pi" banner
    piApiKey: e.PI_API_KEY,
    piWalletSeed: e.PI_WALLET_SEED,
    fundingMode: e.FUNDING_MODE,
    payoutMode: e.PAYOUT_MODE,
    creditsOnly: e.FUNDING_MODE === 'credits_only',
    pointsMode: e.PAYOUT_MODE === 'points',
    platformFeeBps: e.PLATFORM_FEE_BPS,
    minRewardStroops: e.MIN_REWARD_STROOPS,
    minWithdrawStroops: e.MIN_WITHDRAW_STROOPS,
    maxResponsesPerDay: e.MAX_RESPONSES_PER_DAY,
    moderationRequired: e.MODERATION_REQUIRED,
    sessionSecret: e.SESSION_SECRET,
    supabaseUrl: e.SUPABASE_URL,
    supabaseServiceKey: e.SUPABASE_SERVICE_ROLE_KEY,
    anthropicApiKey: e.ANTHROPIC_API_KEY,
    anthropicModel: e.ANTHROPIC_MODEL,
    aiDailyCapPerUser: e.AI_DAILY_CAP_PER_USER,
    adminUids: e.ADMIN_UIDS.split(',').map((s) => s.trim()).filter(Boolean),
    cronSecret: e.CRON_SECRET,
    appBaseUrl: e.APP_BASE_URL,
  };
}

/** Server only. Validated once, then cached. Throws a readable error if env is wrong. */
export function getServerConfig() {
  if (!cached) cached = build();
  return cached;
}

export type ServerConfig = ReturnType<typeof getServerConfig>;

/** Flags the UI is allowed to know (returned by GET /api/config/public). */
export function getPublicFlags() {
  const c = getServerConfig();
  return {
    isTestMode: c.isTestMode,
    fundingMode: c.fundingMode,
    payoutMode: c.payoutMode,
    pointsMode: c.pointsMode,
    creditsOnly: c.creditsOnly,
    stroopsPerPoint: publicConfig.stroopsPerPoint,
    platformFeeBps: c.platformFeeBps,
  };
}
