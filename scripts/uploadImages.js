const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// подключение к supabase
const supabase = createClient(
    "https://dewxobvbnyxflymvoyxk.supabase.co",
    "sb_secret_4MYuIbFrR9ydz25aeYn8Rw_AJsJgfl4"
);

const localDir = path.join(process.cwd(), '../public/catalog/products');

async function uploadAll() {
  const productDirs = fs.readdirSync(localDir);

  for (const productId of productDirs) {
    const productPath = path.join(localDir, productId);
    if (!fs.statSync(productPath).isDirectory()) continue;

    const files = fs.readdirSync(productPath);

    for (const fileName of files) {
      const filePath = path.join(productPath, fileName);
      const fileBuffer = fs.readFileSync(filePath);

      const supabasePath = `${productId}/${fileName}`;

      console.log(`⏫ Загружаю ${supabasePath}...`);

      const { error } = await supabase.storage
          .from('products')
          .upload(supabasePath, fileBuffer, {
            cacheControl: '3600',
            upsert: true,
          });

      if (error) {
        console.error(`❌ Ошибка при загрузке ${supabasePath}:`, error.message);
      } else {
        console.log(`✅ Загружено: ${supabasePath}`);
      }
    }
  }
}

uploadAll().then(() => console.log('Готово!'));
