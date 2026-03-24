import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, emoji, description, cover_image, sort_order, is_active FROM categories ORDER BY sort_order ASC"
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
      id,
      name,
      description,
      cover_image,
      sort_order,
      is_active,
      emoji,
    } = body ?? {};

    const newId =
      id ?? `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const { insertId, ...rest } = await pool.query(
      "INSERT INTO categories (id, name, description, cover_image, sort_order, is_active, emoji) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        newId,
        name,
        description ?? null,
        cover_image ?? null,
        Number(sort_order ?? 0),
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : 1,
        emoji ?? null,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ? LIMIT 1", [newId]);
    return NextResponse.json(rows?.[0] ?? { id: newId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

