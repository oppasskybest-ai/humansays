/**
 * Claude API wrapper, SERVER ONLY (spec L9). Owner: Opeyemi.
 * Requirements: per-user daily cost cap, cache in `ai_cache`, JSON parse + zod validate, retry once,
 * degrade gracefully (hide the feature or show "try again"). Model name comes from ANTHROPIC_MODEL.
 */
export async function askClaudeJson<T>(_params: { system: string; user: string; schemaName: string }): Promise<T> {
  throw new Error('askClaudeJson not implemented yet (L9)');
}
