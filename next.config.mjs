/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        // new URL("https://dewxobvbnyxflymvoyxk.supabase.co/**"),
      {
        protocol: 'https',
        hostname: 'dewxobvbnyxflymvoyxk.supabase.co',
        pathname: '**'
      }
    ],
    // domains: ["dewxobvbnyxflymvoyxk.supabase.co"]
  },
  env: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
  },
};

export default nextConfig;
