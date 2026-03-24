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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const pool = getPool();
    const body = await request.json();

    const settingsObj: Record<string, string> = body ?? {};
    const keys = Object.keys(settingsObj);

    // Upsert each setting.
    for (const key of keys) {
      const value = settingsObj[key] ?? "";
      await pool.query(
        `INSERT INTO site_settings (id, setting_key, setting_value)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [`ss-${Date.now()}-${Math.random().toString(16).slice(2)}`, key, value]
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

