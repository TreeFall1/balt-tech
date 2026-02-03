// app/api/favorites/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
        .from("favorite_products")
        .select("product_id");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
          { error: error.message },
          { status: 500 }
      );
    }

    // Было: row.products_id → нужно: row.product_id
    const productIds = (data || []).map((row) => row.product_id);

    return NextResponse.json({ product_ids: productIds });
  } catch (err) {
    console.error("Favorites GET error:", err);
    return NextResponse.json(
        { error: err.message },
        { status: 500 }
    );
  }
}
