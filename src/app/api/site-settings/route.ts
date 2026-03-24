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

    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to load site settings" },
      { status: 500 }
    );
  }
}

