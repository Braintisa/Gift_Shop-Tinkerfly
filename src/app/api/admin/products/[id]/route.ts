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
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [derivedId]);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Product not found", requestedId: derivedId }, { status: 404 });
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
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const body = await request.json();

    const allowed: Record<string, string> = {
      name: "name",
      description: "description",
      price: "price",
      badge: "badge",
      is_featured: "is_featured",
      is_active: "is_active",
      customizable: "customizable",
      sort_order: "sort_order",
      category_id: "category_id",
    };

    const fields: string[] = [];
    const values: any[] = [];

    Object.keys(body ?? {}).forEach((key) => {
      if (!allowed[key]) return;
      fields.push(`${allowed[key]} = ?`);
      const v = (body as any)[key];
      if (key === "is_featured" || key === "is_active" || key === "customizable") {
        values.push(typeof v === "boolean" ? (v ? 1 : 0) : v);
      } else if (key === "price") {
        values.push(v ?? 0);
      } else {
        values.push(v);
      }
    });

    if (fields.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;
    values.push(derivedId);
    const [result] = await pool.query(sql, values);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Product not found", requestedId: derivedId }, { status: 404 });
    }

    const [rows] = await pool.query("SELECT id FROM products WHERE id = ? LIMIT 1", [derivedId]);
    return NextResponse.json(rows?.[0] ?? { id: derivedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
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
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

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
    } = body ?? {};

    const [updateResult] = await pool.query(
      `UPDATE products SET
        category_id = ?,
        name = ?,
        description = ?,
        price = ?,
        badge = ?,
        is_featured = ?,
        is_active = ?,
        customizable = ?,
        sort_order = ?
       WHERE id = ?`,
      [
        category_id ?? null,
        name,
        description ?? null,
        price ?? 0,
        badge ?? null,
        typeof is_featured === "boolean" ? (is_featured ? 1 : 0) : 0,
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : 1,
        typeof customizable === "boolean" ? (customizable ? 1 : 0) : 0,
        Number(sort_order ?? 0),
        derivedId,
      ]
    );
    const affectedRows = (updateResult as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Product not found", requestedId: derivedId }, { status: 404 });
    }

    // Replace images
    await pool.query("DELETE FROM product_images WHERE product_id = ?", [derivedId]);

    const safeImages = Array.isArray(images)
      ? images.filter((u: any) => typeof u === "string" && u.trim() !== "")
      : [];

    if (safeImages.length > 0) {
      const values = safeImages.map((url: string, idx: number) => [
        `img-${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
        derivedId,
        url,
        idx,
      ]);

      await pool.query(
        "INSERT INTO product_images (id, product_id, image_path, sort_order) VALUES ?",
        [values]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

