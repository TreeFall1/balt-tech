// /app/api/products/delete/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1️⃣ Удаляем все параметры товара
    const { error: paramsError } = await supabase
        .from("product_params")
        .delete()
        .eq("product_id", productId);

    if (paramsError) {
      console.error("Error deleting product_params:", paramsError);
      throw new Error("Failed to delete product_params");
    }

    // 2️⃣ Удаляем сам товар
    const { error: productError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (productError) {
      console.error("Error deleting product:", productError);
      throw new Error("Failed to delete product");
    }

    // 3️⃣ Удаляем папку из Storage (если есть)
    const { data: files } = await supabase.storage.from("products").list(`${productId}`);

    if (files && files.length > 0) {
      const paths = files.map((file) => `${productId}/${file.name}`);
      await supabase.storage.from("products").remove(paths);
    }

    // 4️⃣ Удаляем саму папку (Supabase не всегда делает это автоматически)
    await supabase.storage.from("products").remove([`${productId}/`]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
