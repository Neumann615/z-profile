import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "cloudflare-ipfs.com",
      "cdn.docschina.org",
    ],
    formats: ["image/webp"],
  },
}

export default withNextIntl(nextConfig)
