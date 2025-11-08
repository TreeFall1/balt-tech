/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://dewxobvbnyxflymvoyxk.supabase.co/**")],
    domains: ["dewxobvbnyxflymvoyxk.supabase.co"]
  }
};

export default nextConfig;
