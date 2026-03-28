/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    "@prisma/adapter-libsql",
    "@libsql/client",
    "libsql",
    "@libsql/hrana-client",
    "@libsql/isomorphic-fetch",
    "@libsql/isomorphic-ws",
  ],
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
