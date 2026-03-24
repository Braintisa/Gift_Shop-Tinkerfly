import { NextResponse } from "next/server";

function pickImgbbDirectUrl(payload: unknown): string | undefined {
  const d = payload as {
    data?: {
      display_url?: string;
      image?: { url?: string };
      url?: string;
    };
  };
  const a = d?.data?.image?.url?.trim();
  const b = d?.data?.display_url?.trim();
  const c = d?.data?.url?.trim();
  if (a) return a;
  if (b) return b;
  if (c && c.includes("i.ibb.co")) return c;
  return undefined;
}

/** Upload to ImgBB (server-side key). Form field: `image` = File */
export async function POST(request: Request) {
  try {
    const rawKey = process.env.IMGBB_API_KEY?.replace(/^["']|["']$/g, "").trim();
    if (!rawKey) {
      return NextResponse.json({ error: "IMGBB_API_KEY is not configured" }, { status: 500 });
    }

    const incoming = await request.formData();
    const file = incoming.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No image file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");

    const body = new URLSearchParams();
    body.set("key", rawKey);
    body.set("image", base64);

    const res = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json().catch(() => ({}));
    const url = pickImgbbDirectUrl(data);

    if (!(data as { success?: boolean })?.success || !url) {
      return NextResponse.json(
        { error: (data as { error?: { message?: string } })?.error?.message || "ImgBB upload failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 });
  }
}
