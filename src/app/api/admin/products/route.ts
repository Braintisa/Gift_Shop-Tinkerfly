import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, category_id, name, description, price, badge, is_featured, is_active, customizable, sort_order FROM products ORDER BY sort_order ASC"
    );
    return NextResponse.json(rows ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const pool = getPool();
    const body = await request.json();
    const {
      name,
      description,
      price,
      category_id,
      badge,
      is_featured,
      is_active,
      customizable,
      sort_order,
      images,
      id,
    } = body ?? {};

    const newId =
      id ?? `prod-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    await pool.query(
      `INSERT INTO products
        (id, category_id, name, description, price, badge, is_featured, is_active, customizable, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        category_id ?? null,
        name,
        description ?? null,
        price ?? 0,
        badge ?? null,
        typeof is_featured === "boolean" ? (is_featured ? 1 : 0) : 0,
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : 1,
        typeof customizable === "boolean" ? (customizable ? 1 : 0) : 0,
        Number(sort_order ?? 0),
      ]
    );

    const safeImages = Array.isArray(images)
      ? images.filter((u: any) => typeof u === "string" && u.trim() !== "")
      : [];

    if (safeImages.length > 0) {
      const values = safeImages.map((url: string, idx: number) => [
        `img-${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
        newId,
        url,
        idx,
      ]);
      await pool.query(
        "INSERT INTO product_images (id, product_id, image_path, sort_order) VALUES ?",
        [values]
      );
    }

    const [rows] = await pool.query(
      "SELECT id FROM products WHERE id = ? LIMIT 1",
      [newId]
    );
    return NextResponse.json(rows?.[0] ?? { id: newId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

