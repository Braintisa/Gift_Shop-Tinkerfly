import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();

    const [cats] = await pool.query("SELECT COUNT(*) as cnt FROM categories");
    const [prods] = await pool.query("SELECT COUNT(*) as cnt FROM products");
    const [imgs] = await pool.query("SELECT COUNT(*) as cnt FROM product_images");
    const [featured] = await pool.query("SELECT COUNT(*) as cnt FROM products WHERE is_featured = 1");

    const [testimonials] = await pool.query(
      "SELECT COUNT(*) as cnt FROM testimonials WHERE is_active = 1"
    );
    const [gallery] = await pool.query(
      "SELECT COUNT(*) as cnt FROM social_gallery WHERE is_active = 1"
    );

    const c = (cats as any[])[0]?.cnt ?? 0;
    const p = (prods as any[])[0]?.cnt ?? 0;
    const i = (imgs as any[])[0]?.cnt ?? 0;
    const f = (featured as any[])[0]?.cnt ?? 0;
    const t = (testimonials as any[])[0]?.cnt ?? 0;
    const g = (gallery as any[])[0]?.cnt ?? 0;

    return NextResponse.json({
      categories: c,
      products: p,
      images: i,
      featured: f,
      testimonials: t,
      gallery: g,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

