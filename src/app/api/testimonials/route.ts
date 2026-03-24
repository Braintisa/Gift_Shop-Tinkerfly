import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, role, content, rating, avatar_url, is_active, sort_order FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    return NextResponse.json(rows ?? []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

