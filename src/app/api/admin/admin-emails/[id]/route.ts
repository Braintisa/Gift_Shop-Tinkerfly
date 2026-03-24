import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool();
    // Also remove any linked admin user credentials.
    const [emailRows] = await pool.query(
      "SELECT email FROM admin_emails WHERE id = ? LIMIT 1",
      [params.id]
    );
    const email = (emailRows as any[])[0]?.email;
    await pool.query("DELETE FROM admin_emails WHERE id = ?", [params.id]);
    if (email) {
      await pool.query("DELETE FROM admin_users WHERE LOWER(email) = LOWER(?)", [email]);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pool = getPool();
    const body = await request.json();
    const { active, keyword } = body ?? {};

    const sets: string[] = [];
    const values: any[] = [];

    if (typeof active === "boolean") {
      sets.push("active = ?");
      values.push(active ? 1 : 0);
    }

    if (keyword !== undefined) {
      sets.push("recovery_keyword = ?");
      values.push(keyword || null);
    }

    if (sets.length === 0) return NextResponse.json({ error: "No fields" }, { status: 400 });

    values.push(params.id);
    await pool.query(`UPDATE admin_emails SET ${sets.join(", ")} WHERE id = ?`, values);

    // If the keyword changes (and it's non-empty), keep `admin_users` password_hash in sync.
    if (keyword !== undefined) {
      const normalizedKeyword = typeof keyword === "string" ? keyword : keyword == null ? "" : String(keyword);
      if (normalizedKeyword.trim()) {
        const [emailRows] = await pool.query(
          "SELECT email FROM admin_emails WHERE id = ? LIMIT 1",
          [params.id]
        );
        const email = (emailRows as any[])[0]?.email;
        if (email) {
          const passwordHash = Buffer.from(normalizedKeyword.trim()).toString("base64");
          await pool.query(
            `INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
            [`au-${Date.now()}-${Math.random().toString(16).slice(2)}`, email, passwordHash]
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

