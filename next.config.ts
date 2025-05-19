/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Esto hace que Next.js ignore los errores de TypeScript durante la compilación
    ignoreBuildErrors: true,
  },
  eslint: {
    // Opcionalmente, también podemos ignorar errores de ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig