/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://dewxobvbnyxflymvoyxk.supabase.co/**")],
    domains: ["dewxobvbnyxflymvoyxk.supabase.co"]
  },
  env: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

export default nextConfig;
