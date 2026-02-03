import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ items: [] });
    }

    const { data, error } = await supabase.rpc("search_products", {
      search_query: query
    });

    if (error) {
      console.error("Search RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ items: data });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
