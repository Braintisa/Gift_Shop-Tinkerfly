import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const pool = getPool();

    const identifier = String(email).toLowerCase().trim();
    const suppliedHash = Buffer.from(String(password)).toString("base64");

    const [rows] = await pool.query(
      "SELECT id, email, password_hash FROM admin_users WHERE LOWER(email) = ? LIMIT 1",
      [identifier]
    );

    const admins = rows as any[];
    if (!admins.length) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const admin = admins[0];
    const expectedHash = admin.password_hash as string;

    if (suppliedHash !== expectedHash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Login failed" }, { status: 500 });
  }
}

