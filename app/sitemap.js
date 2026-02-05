// app/sitemap.js
export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balttech-service.ru";

  const staticRoutes = [
    "",
    "/about",
    "/contacts",
    "/catalog",
  ].map((route) => ({ url: `${siteUrl}${route}`, lastModified: new Date() }));

  // Try to fetch dynamic product IDs
  let productEntries = [];
  try {
    const res = await fetch(`${siteUrl}/api/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        productEntries = products
          .filter((p) => p && p.id)
          .map((p) => ({ url: `${siteUrl}/products/${p.id}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date() }));
      }
    }
  } catch (_) {
    // ignore fetching errors to keep sitemap working
  }

  // Category routes (1..N) — if you maintain a known list, add them here
  const categoryCount = 12; // adjust to actual categories count
  const categoryEntries = Array.from({ length: categoryCount }, (_, i) => i + 1).map((id) => ({
    url: `${siteUrl}/catalog/${id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryEntries, ...productEntries];
}
