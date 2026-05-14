import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'appx-content-v2.classx.co.in' },
      { protocol: 'https', hostname: 'appx-wsb-gcp.akamai.net.in' },
      { protocol: 'https', hostname: 'appx-wsb-gcp-mcdn.akamai.net.in' },
      { protocol: 'https', hostname: 'appxcontent.kaxa.in' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
    ],
  },
  transpilePackages: ['motion'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
