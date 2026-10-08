import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAllProducts,
  saveProduct,
  deleteProduct,
  getProductById,
} from "@/lib/repository";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sort") as any) || "featured";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;
    const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : undefined;
    const activeOnly = searchParams.get("activeOnly") === "false" ? false : true;

    const result = getAllProducts({
      categoryId,
      search,
      sortBy,
      limit,
      offset,
      activeOnly,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Products GET error:", error);
    return NextResponse.json({ products: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.name || !data.category_id) {
      return NextResponse.json({ error: "Product name and category are required" }, { status: 400 });
    }

    const saved = saveProduct(data);
    return NextResponse.json({ success: true, product: saved });
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
    const bulkIds = searchParams.get("bulkIds");

    if (bulkIds) {
      const ids = bulkIds.split(",");
      const db = getDb();
      const stmt = db.prepare("DELETE FROM products WHERE id = ?");
      for (const singleId of ids) {
        stmt.run(singleId);
      }
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const ok = deleteProduct(id);
    return NextResponse.json({ success: ok });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
