import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, email, created_at FROM admin_users ORDER BY created_at ASC"
    );
    return NextResponse.json(rows ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to load admin users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const pool = getPool();
    const body = await request.json();
    const emailRaw = body?.email;
    const passwordRaw = body?.password;

    const email = typeof emailRaw === "string" ? emailRaw.toLowerCase().trim() : "";
    const password = typeof passwordRaw === "string" ? passwordRaw : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const passwordHash = Buffer.from(password).toString("base64");
    const newId = `au-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    try {
      await pool.query(
        "INSERT INTO admin_users (id, email, password_hash) VALUES (?, ?, ?)",
        [newId, email, passwordHash]
      );
    } catch (err: any) {
      // MySQL duplicate key
      if (typeof err?.code === "string" && err.code.includes("ER_DUP_ENTRY")) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 });
      }
      throw err;
    }

    return NextResponse.json({ ok: true, id: newId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to create admin user" }, { status: 500 });
  }
}

