// app/api/config/route.js


export async function GET() {
  return Response.json({ apiKey: process.env.SUPABASE_SERVICE_ROLE_KEY });
}
