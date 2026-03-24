import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, role, content, rating, is_active, sort_order FROM testimonials ORDER BY sort_order ASC"
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
      role,
      content,
      rating,
      is_active,
      sort_order,
      id,
    } = body ?? {};

    const newId = id ?? `testi-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    await pool.query(
      `INSERT INTO testimonials (id, name, role, content, rating, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newId,
        name,
        role ?? "",
        content,
        Number(rating ?? 5),
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : 1,
        Number(sort_order ?? 0),
      ]
    );

    return NextResponse.json({ ok: true, id: newId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

