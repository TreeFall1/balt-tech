import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
          { error: "product_id is required" },
          { status: 400 }
      );
    }

    const { data, error } = await supabase
        .from("favorite_products")
        .insert({ product_id }) // колонка в таблице должна называться так же
        .select()
        .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
          { error: error.message },
          { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Favorites POST error:", err);
    return NextResponse.json(
        { error: err.message },
        { status: 500 }
    );
  }
}
