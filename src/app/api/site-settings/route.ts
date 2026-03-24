import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC"
    );

    const settings: Record<string, string> = {};
    (rows as any[]).forEach((r) => {
      settings[r.setting_key] = r.setting_value ?? "";
    });

    return NextResponse.json(settings);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load site settings" },
      { status: 500 }
    );
  }
}

