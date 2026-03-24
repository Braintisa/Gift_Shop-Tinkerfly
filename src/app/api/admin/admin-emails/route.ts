import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, email, active, recovery_keyword, created_at FROM admin_emails ORDER BY created_at ASC"
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
    const { email, keyword } = body ?? {};

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const newId = `ae-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const normalizedEmail = String(email).toLowerCase().trim();
    const normalizedKeyword = typeof keyword === "string" ? keyword : keyword == null ? "" : String(keyword);

    await pool.query(
      "INSERT INTO admin_emails (id, email, recovery_keyword, active) VALUES (?, ?, ?, 1)",
      [newId, normalizedEmail, normalizedKeyword.trim() ? normalizedKeyword : null]
    );

    // Keep `admin_users` in sync so the admin email dashboard can be used for login.
    // If a recovery keyword is provided, we treat it as the initial login password.
    if (normalizedKeyword.trim()) {
      const newAdminUserId = `au-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const passwordHash = Buffer.from(normalizedKeyword).toString("base64");
      await pool.query(
        `INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
        [newAdminUserId, normalizedEmail, passwordHash]
      );
    }

    return NextResponse.json({ ok: true, id: newId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

