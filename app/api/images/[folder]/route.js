import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  try {
    const { folder } = await params; // название папки продукта
    const productDir = path.join(process.cwd(), "public/catalog/products", folder);

    // Проверка, существует ли папка
    if (!fs.existsSync(productDir)) {
      return new Response(JSON.stringify({ error: "Папка не найдена" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const files = fs.readdirSync(productDir);
    const images = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

    return new Response(JSON.stringify({ count: images.length, files: images }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
