const libsqlPackageTraceIncludes = [
  "./node_modules/@prisma/adapter-libsql/**/*",
  "./node_modules/@libsql/client/**/*",
  "./node_modules/@libsql/core/**/*",
  "./node_modules/@libsql/hrana-client/**/*",
  "./node_modules/@libsql/isomorphic-fetch/**/*",
  "./node_modules/@libsql/isomorphic-ws/**/*",
  "./node_modules/libsql/**/*",
  "./node_modules/js-base64/**/*",
  "./node_modules/promise-limit/**/*",
]

const libsqlTraceIncludes = [
  ...libsqlPackageTraceIncludes,
  "./node_modules/.pnpm/@prisma+adapter-libsql@6.19.2/node_modules/@prisma/adapter-libsql/dist/**/*",
  "./node_modules/.pnpm/@prisma+adapter-libsql@6.19.2/node_modules/@prisma/adapter-libsql/package.json",
  "./node_modules/.pnpm/@libsql+client@0.17.2/node_modules/@libsql/client/**/*",
  "./node_modules/.pnpm/@libsql+core@0.17.2/node_modules/@libsql/core/**/*",
  "./node_modules/.pnpm/@libsql+hrana-client@0.9.0/node_modules/@libsql/hrana-client/**/*",
  "./node_modules/.pnpm/@libsql+isomorphic-fetch@0.2.5/node_modules/@libsql/isomorphic-fetch/**/*",
  "./node_modules/.pnpm/@libsql+isomorphic-ws@0.1.5/node_modules/@libsql/isomorphic-ws/**/*",
  "./node_modules/.pnpm/libsql@0.5.29/node_modules/libsql/**/*",
  "./node_modules/.pnpm/js-base64@3.7.8/node_modules/js-base64/**/*",
  "./node_modules/.pnpm/promise-limit@2.7.0/node_modules/promise-limit/**/*",
]

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
    "/": libsqlTraceIncludes,
    "/dashboard": libsqlTraceIncludes,
    "/api/locations": libsqlTraceIncludes,
    "/api/reviews/[reviewId]/reply": libsqlTraceIncludes,
    "/api/stats": libsqlTraceIncludes,
  },
}

export default nextConfig
