import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await req.json();

  const { data: last } = await supabase
    .from("theme_sections")
    .select("position")
    .eq("theme_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = last ? last.position + 1 : 1;

  const { data, error } = await supabase
    .from("theme_sections")
    .insert({
      theme_id: id,
      section_key: body.section_key,
      section_type: body.section_type,
      default_content: body.default_content,
      position,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
