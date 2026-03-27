/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@prisma/adapter-libsql/**/*",
      "./node_modules/@libsql/client/**/*",
    ],
  },
}

export default nextConfig
