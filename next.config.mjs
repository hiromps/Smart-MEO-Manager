/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/adapter-libsql", "@libsql/client"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
