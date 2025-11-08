import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const username = req.headers.get("X-Username");
    if (username !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const data = await req.formData();
    const title = data.get('name') || data.get('title'); // <-- поддерживаем оба варианта
    const price = data.get('price');
    const tag = data.get('tag') || null;
    const category = data.get('category') || null;
    const paramsRaw = data.get('params') || '[]';

    let params = [];
    try {
      params = JSON.parse(paramsRaw);
    } catch {
      params = [];
    }

    // 1️⃣ Добавляем товар
    const { data: productData, error: insertError } = await supabase
        .from('products')
        .insert([{ title, price, tag, category }]) // <-- title вместо name
        .select()
        .single();

    if (insertError) {
      console.error(insertError);
      return new Response(JSON.stringify({ error: insertError.message }), { status: 400 });
    }

    const productId = productData.id;

    // 2️⃣ Добавляем характеристики
    const formattedParams = params
        .filter((p) => p.name && p.value)
        .map((p) => ({
          product_id: productId,
          name: p.name,
          value: p.value,
        }));

    if (formattedParams.length > 0) {
      const { error: paramsError } = await supabase.from('product_params').insert(formattedParams);
      if (paramsError) {
        console.error(paramsError);
        return new Response(JSON.stringify({ error: paramsError.message }), { status: 400 });
      }
    }

    // 3️⃣ Загружаем изображения
    let imageIndex = 1;
    const files = data.getAll('images');
    const uploadedImages = [];

    for (const file of files) {
      const filename = `${imageIndex}.jpg`;
      imageIndex++;

      const { data: fileData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(`${productId}/${filename}`, file, {
            contentType: file.type || "image/jpeg",
            cacheControl: '3600',
            upsert: true,
          });

      if (uploadError) {
        console.error(uploadError);
        return new Response(JSON.stringify({ error: uploadError.message }), { status: 400 });
      }

      uploadedImages.push(fileData.path);
    }

    return new Response(
        JSON.stringify({ success: true, product: productData, images: uploadedImages }),
        { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
