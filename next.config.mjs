/** @type {import('next').NextConfig} */

const nextConfig = {
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

export default nextConfig
