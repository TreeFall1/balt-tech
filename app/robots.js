// app/robots.js
export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balttech-service.ru";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
      ],
    },
    host: siteUrl.replace(/\/$/, ""),
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
