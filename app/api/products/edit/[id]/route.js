import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "No product id provided" }, { status: 400 });

    const formData = await req.formData();

    // === 1️⃣ Получаем данные из формы ===
    const title = formData.get("title") || formData.get("name");
    const price = formData.get("price");
    const category = formData.get("category");
    const tag = formData.get("tag");
    const paramsJSON = formData.get("params");
    const images = formData.getAll("images"); // File[]
    const mainImage = formData.get("mainImage"); // имя, url или File

    const productParams = JSON.parse(paramsJSON || "[]");

    // === 2️⃣ Обновляем таблицу products ===
    const { error: updateError } = await supabase
        .from("products")
        .update({ title, price, category, tag })
        .eq("id", id);

    if (updateError) throw updateError;

    // === 3️⃣ Обновляем параметры товара ===
    // Сначала удаляем все старые
    await supabase.from("product_params").delete().eq("product_id", id);

    // Вставляем новые параметры + описание
    const formattedParams = productParams
        .filter((p) => p.name && p.value)
        .map((p) => ({
          product_id: id,
          name: p.name,
          value: p.value,
        }));

    if (formattedParams.length > 0) {
      const { error: insertParamsError } = await supabase
          .from("product_params")
          .insert(formattedParams);
      if (insertParamsError) throw insertParamsError;
    }

    // === 4️⃣ Работа с изображениями ===
    // Получаем текущие файлы
    const { data: existingFiles, error: listError } = await supabase.storage
        .from("products")
        .list(`${id}/`);
    if (listError) console.warn("List error:", listError);

    const existingNames = existingFiles?.map((f) => f.name) || [];
    let nextIndex =
        existingNames.length > 0
            ? Math.max(...existingNames.map((n) => parseInt(n))) + 1
            : 1;

    // === 5️⃣ Удаление старых изображений (если надо) ===
    const toDeleteJSON = formData.get("deleteImages"); // JSON ["1.jpg", "3.jpg"]
    if (toDeleteJSON) {
      const toDelete = JSON.parse(toDeleteJSON);
      if (Array.isArray(toDelete) && toDelete.length > 0) {
        const { error: removeError } = await supabase.storage
            .from("products")
            .remove(toDelete.map((f) => `${id}/${f}`));
        if (removeError) console.warn("Ошибка удаления файлов:", removeError);
      }
    }

    // === 6️⃣ Добавление новых изображений ===
    for (const img of images) {
      const arrayBuffer = await img.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const filename = `${nextIndex}.jpg`;
      nextIndex++;

      const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(`${id}/${filename}`, buffer, {
            contentType: img.type || "image/jpeg",
            upsert: true,
          });

      if (uploadError) throw uploadError;
    }

    // === 7️⃣ Установка главной картинки ===
    let mainFilename = null;

    if (mainImage) {
      if (typeof mainImage === "object" && "name" in mainImage) {
        // если это File — берём имя (или имя после загрузки)
        mainFilename = `${existingNames.length + 1}.jpg`;
      } else if (typeof mainImage === "string") {
        if (mainImage.startsWith("http")) {
          mainFilename = mainImage.split("/").pop();
        } else {
          mainFilename = mainImage;
        }
      }
    }

    // если не указана — ставим 1.jpg
    if (!mainFilename) mainFilename = "1.jpg";

    const { error: mainUpdateError } = await supabase
        .from("products")
        .update({ main_image: mainFilename })
        .eq("id", id);

    if (mainUpdateError) throw mainUpdateError;

    // === ✅ Успешный ответ ===
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PUT /api/products/edit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
