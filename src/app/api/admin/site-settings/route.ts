import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();
    let rows: unknown[];
    try {
      const [r] = await pool.query(
        "SELECT setting_key, setting_value FROM site_settings ORDER BY id DESC"
      );
      rows = r as unknown[];
    } catch {
      const [r] = await pool.query(
        "SELECT setting_key, setting_value FROM site_settings ORDER BY setting_key ASC"
      );
      rows = r as unknown[];
    }
    const settings: Record<string, string> = {};
    (rows as any[]).forEach((r) => {
      const k = r.setting_key as string;
      if (!(k in settings)) {
        settings[k] = (r.setting_value ?? "") as string;
      }
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

    for (const key of keys) {
      const value = settingsObj[key] ?? "";
      const [updateResult] = await pool.query(
        "UPDATE site_settings SET setting_value = ? WHERE setting_key = ?",
        [value, key]
      );
      const affected = (updateResult as { affectedRows?: number }).affectedRows ?? 0;
      if (affected === 0) {
        await pool.query(
          "INSERT INTO site_settings (id, setting_key, setting_value) VALUES (?, ?, ?)",
          [`ss-${Date.now()}-${Math.random().toString(16).slice(2)}`, key, value]
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

