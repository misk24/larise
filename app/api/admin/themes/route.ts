import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  const slug = slugify(body.name, { lower: true });

  const { data, error } = await supabase
    .from("themes")
    .insert({
      name: body.name,
      slug,
      is_active: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
