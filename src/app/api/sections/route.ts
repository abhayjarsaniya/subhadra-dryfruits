import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAllHomepageSections,
  saveHomepageSection,
  deleteHomepageSection,
} from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const sections = getAllHomepageSections(includeInactive);
    return NextResponse.json(sections);
  } catch (error: any) {
    console.error("Sections GET error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title) {
      return NextResponse.json({ error: "Section title is required" }, { status: 400 });
    }

    const saved = saveHomepageSection(data);
    return NextResponse.json({ success: true, section: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Section ID required" }, { status: 400 });
    }
    const ok = deleteHomepageSection(id);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
