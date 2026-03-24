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
      return NextResponse.json({ error: "Missing social gallery id" }, { status: 400 });
    }

    const [result] = await pool.query("DELETE FROM social_gallery WHERE id = ?", [derivedId]);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Social gallery item not found", requestedId: derivedId },
        { status: 404 }
      );
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
      return NextResponse.json({ error: "Missing social gallery id" }, { status: 400 });
    }

    const body = await request.json();
    const allowed: Record<string, string> = {
      image_url: "image_url",
      caption: "caption",
      link_url: "link_url",
      is_active: "is_active",
      sort_order: "sort_order",
    };

    const fields: string[] = [];
    const values: any[] = [];
    Object.keys(body ?? {}).forEach((key) => {
      if (!allowed[key]) return;
      fields.push(`${allowed[key]} = ?`);
      const v = (body as any)[key];
      if (key === "is_active") values.push(typeof v === "boolean" ? (v ? 1 : 0) : v);
      else values.push(v);
    });

    if (fields.length === 0) return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    values.push(derivedId);
    const [result] = await pool.query(`UPDATE social_gallery SET ${fields.join(", ")} WHERE id = ?`, values);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Social gallery item not found", requestedId: derivedId },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, affectedRows });
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
      return NextResponse.json({ error: "Missing social gallery id" }, { status: 400 });
    }

    const body = await request.json();
    const { image_url, caption, link_url, is_active, sort_order } = body ?? {};

    const [result] = await pool.query(
      `UPDATE social_gallery SET
        image_url = ?, caption = ?, link_url = ?, is_active = ?, sort_order = ?
       WHERE id = ?`,
      [
        image_url,
        caption ?? "",
        link_url ?? "",
        typeof is_active === "boolean" ? (is_active ? 1 : 0) : 1,
        Number(sort_order ?? 0),
        derivedId,
      ]
    );
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Social gallery item not found", requestedId: derivedId },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, affectedRows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

