import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();

    const [products] = await pool.query(
      "SELECT id, category_id, name, description, price, badge FROM products WHERE is_active = 1 AND is_featured = 1 ORDER BY sort_order ASC"
    );

    const [images] = await pool.query(
      "SELECT product_id, image_path, sort_order FROM product_images ORDER BY sort_order ASC"
    );

    const [categories] = await pool.query(
      "SELECT id, name FROM categories"
    );

    const prods = products as any[];
    const imgs = images as any[];
    const cats = categories as any[];

    const mapped = prods.map((p) => {
      const pImgs = imgs.filter((i) => i.product_id === p.id);
      const validImages = pImgs
        .map((i) => i.image_path)
        .filter((u: any) => typeof u === "string" && u.trim() !== "");
      const cat = cats.find((c) => c.id === p.category_id);

      return {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        description: p.description ?? "",
        badge: p.badge || undefined,
        image: validImages[0] ?? "",
        images: validImages,
        categoryName: cat?.name ?? "",
      };
    });

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


