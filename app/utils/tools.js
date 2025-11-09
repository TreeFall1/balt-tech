import axios from "axios";
import {createClient} from "@supabase/supabase-js";
// import { supabase } from '@/app/utils/supabase';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);


export const supabaseStorage = "https://dewxobvbnyxflymvoyxk.supabase.co/storage/v1/object/public"

export async function fetchProducts({ id, limit } = {}) {
  try {
    const params = {};
    if (id) params.id = id;
    if (limit) params.limit = limit;

    const response = await axios.get('/api/products', { params });
    return response.data;
  } catch (err) {
    console.error('Ошибка при получении продуктов:', err);
    return null;
  }
}

export async function getProductImages(productId) {
  // Сначала проверяем кэш
  const cached = sessionStorage.getItem(`product_images_${productId}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      sessionStorage.removeItem(`product_images_${productId}`);
    }
  }

  // Если в кэше нет — запрашиваем у Supabase
  const { data, error } = await supabase.storage
      .from("products")
      .list(`${productId}`, { limit: 100 });

  if (error) {
    console.error("Ошибка при получении файлов:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn(`⚠️ Нет изображений в папке ${productId}`);
    return [];
  }

  const imageUrls = data
      .sort((a, b) => parseInt(a.name) - parseInt(b.name))
      .map(
          (file) =>
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${productId}/${file.name}`
      );

  // Сохраняем в кэш
  sessionStorage.setItem(
      `product_images_${productId}`,
      JSON.stringify(imageUrls)
  );

  return imageUrls;
}






