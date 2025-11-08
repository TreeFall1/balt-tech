// app/api/products/route.js
import { supabase } from '@/app/utils/supabase';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');       // ?id=1
    const limit = url.searchParams.get('limit'); // ?limit=5

    if (id) {
      // Получаем продукт по id
      const { data, error } = await supabase
          .from('products')
          .select('*, product_params(*)') // relationship name
          .eq('id', id)
          .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }

      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      // Получаем все продукты (с возможным лимитом)
      let query = supabase
          .from('products')
          .select('*, product_params(*)');

      if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      const { data, error } = await query;

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
