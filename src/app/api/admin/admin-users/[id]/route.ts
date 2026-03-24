import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function DELETE(
  request: Request,
  context: { params: { id?: string } }
) {
  try {
    const { params } = context;
    const derivedId =
      params?.id ??
      new URL(request.url).pathname.split("/").filter(Boolean).pop() ??
      "";
    const pool = getPool();
    const [result] = await pool.query("DELETE FROM admin_users WHERE id = ?", [derivedId]);
    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json({ error: "Admin user not found", requestedId: derivedId }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to delete admin user" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id?: string } }
) {
  try {
    const { params } = context;
    const derivedId =
      params?.id ??
      new URL(request.url).pathname.split("/").filter(Boolean).pop() ??
      "";
    const pool = getPool();
    const body = await request.json();
    const passwordRaw = body?.password;

    const password = typeof passwordRaw === "string" ? passwordRaw : "";
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const passwordHash = Buffer.from(password).toString("base64");
    const [result] = await pool.query(
      "UPDATE admin_users SET password_hash = ? WHERE id = ?",
      [passwordHash, derivedId]
    );

    const affectedRows = (result as any)?.affectedRows ?? 0;
    if (affectedRows === 0) {
      return NextResponse.json(
        { error: "Admin user not found", requestedId: derivedId },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, affectedRows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to update admin user" }, { status: 500 });
  }
}

