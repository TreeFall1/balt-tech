import { supabase } from "@/app/utils/supabase";

export async function generateMetadata({ params }) {
  const { productId } = params || {};

  if (!productId) {
    return {
      title: "Товар",
      description: "Страница товара",
      alternates: { canonical: "/products" },
    };
  }

  // Fetch product from Supabase directly to avoid relying on external URL during build
  let product = null;
  try {
    const { data } = await supabase
      .from("products")
      .select("*, product_params(*)")
      .eq("id", productId)
      .single();
    product = data;
  } catch (_) {}

  const title = product?.title || `Товар #${productId}`;
  const descriptionParam = Array.isArray(product?.product_params)
    ? product.product_params.find((p) => p.name === "Описание")?.value
    : undefined;
  const description = descriptionParam ||
    `Купить ${title} с доставкой по всей России. Сертифицированная продукция. Узнать цену и наличие.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://balttech-service.ru";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const mainImage = product?.main_image
    ? `${supabaseUrl}/storage/v1/object/public/products/${productId}/${product.main_image}`
    : `${supabaseUrl}/storage/v1/object/public/products/${productId}/1.jpg`;

  return {
    title,
    description,
    alternates: { canonical: `/products/${productId}` },
    openGraph: {
      type: "product",
      url: `${baseUrl}/products/${productId}`,
      title,
      description,
      images: mainImage ? [{ url: mainImage, width: 1200, height: 1200, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : undefined,
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}
