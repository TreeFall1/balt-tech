/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    //ОТКЛЮЧИТЬ НА ХОСТИНГЕ
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dewxobvbnyxflymvoyxk.supabase.co',
        pathname: '**'
      }
    ],
  },
  env: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
  },
  // Disable source maps to avoid "Invalid source map" errors coming from some dependencies in dev/SSR
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    // Explicitly turn off source maps in all modes (client and server)
    config.devtool = false;

    // Some presets may push SourceMapDevToolPlugin — remove it defensively
    config.plugins = (config.plugins || []).filter(
      (plugin) => !(plugin && plugin.constructor && plugin.constructor.name === 'SourceMapDevToolPlugin')
    );

    return config;
  },
};

export default nextConfig;
