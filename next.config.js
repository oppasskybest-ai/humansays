/** @type {import('next').NextConfig} */

// Pi Sandbox embedding rules (PI_NETWORK_DEV_GUIDE.md section 20.5):
//  - NEVER send X-Frame-Options
//  - CSP frame-ancestors only: 'self', *.pinet.com, *.minepi.com (no other wildcards)
//  - connect-src must include 'self' and https://socialchain.app (Pi SDK calls)
// If the BROWSER ever needs to call another API, add it to connect-src below.
const isDev = process.env.NODE_ENV !== 'production';

const connectSrc = ["'self'", 'https://socialchain.app'];
if (isDev) connectSrc.push('ws://localhost:*', 'http://localhost:*'); // Next.js hot reload

const csp = [
  "frame-ancestors 'self' https://*.pinet.com https://*.minepi.com",
  `connect-src ${connectSrc.join(' ')}`,
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
        // do NOT add X-Frame-Options
      },
    ];
  },
};

module.exports = nextConfig;
