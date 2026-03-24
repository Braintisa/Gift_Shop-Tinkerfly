import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function DELETE(
  request: Request,
  context: { params?: { id?: string } }
) {
  try {
    const pool = getPool();
    const derivedId =
      context?.params?.id ??
      new URL(request.url).pathname.split("/").filter(Boolean).pop() ??
      "";

    if (!derivedId) {
      return NextResponse.json({ error: "Missing category id" }, { status: 400 });
    }

    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [derivedId]);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Category not found", requestedId: derivedId }, { status: 404 });
    }

    return NextResponse.json({ ok: true, affectedRows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params?: { id?: string } }
) {
  try {
    const pool = getPool();
    const derivedId =
      context?.params?.id ??
      new URL(request.url).pathname.split("/").filter(Boolean).pop() ??
      "";
    if (!derivedId) {
      return NextResponse.json({ error: "Missing category id" }, { status: 400 });
    }

    const body = await request.json();
    const fields: string[] = [];
    const values: any[] = [];

    const allowed: Record<string, string> = {
      name: "name",
      description: "description",
      cover_image: "cover_image",
      sort_order: "sort_order",
      is_active: "is_active",
      emoji: "emoji",
    };

    Object.keys(body ?? {}).forEach((key) => {
      if (!allowed[key]) return;
      fields.push(`${allowed[key]} = ?`);
      const v = (body as any)[key];
      if (key === "is_active") values.push(typeof v === "boolean" ? (v ? 1 : 0) : v);
      else values.push(v);
    });

    if (fields.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;
    values.push(derivedId);
    const [result] = await pool.query(sql, values);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Category not found", requestedId: derivedId }, { status: 404 });
    }

    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ? LIMIT 1", [derivedId]);
    return NextResponse.json(rows?.[0] ?? { id: derivedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params?: { id?: string } }
) {
  // Replace/update full record.
  try {
    const pool = getPool();
    const derivedId =
      context?.params?.id ??
      new URL(request.url).pathname.split("/").filter(Boolean).pop() ??
      "";
    if (!derivedId) {
      return NextResponse.json({ error: "Missing category id" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      description,
      cover_image,
      sort_order,
      is_active,
      emoji,
    } = body ?? {};

    const [result] = await pool.query(
      "UPDATE categories SET name = ?, description = ?, cover_image = ?, sort_order = ?, is_active = ?, emoji = ? WHERE id = ?",
      [
        name,
        description ?? null,
        cover_image ?? null,
        Number(sort_order ?? 0),
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : (is_active ?? 1),
        emoji ?? null,
        derivedId,
      ]
    );
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Category not found", requestedId: derivedId }, { status: 404 });
    }

    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ? LIMIT 1", [derivedId]);
    return NextResponse.json(rows?.[0] ?? { id: derivedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

