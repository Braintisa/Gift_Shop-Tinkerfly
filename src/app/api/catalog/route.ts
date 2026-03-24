import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();

    const [categories] = await pool.query(
      "SELECT id, name, emoji, description FROM categories WHERE is_active = 1 ORDER BY sort_order ASC"
    );

    const [products] = await pool.query(
      "SELECT id, category_id, name, description, price, badge, is_active, is_featured, sort_order FROM products WHERE is_active = 1 ORDER BY sort_order ASC"
    );

    const [images] = await pool.query(
      "SELECT id, product_id, image_path, sort_order FROM product_images ORDER BY sort_order ASC"
    );

    const cats = categories as any[];
    const prods = products as any[];
    const imgs = images as any[];

    const mapped = cats.map((cat) => {
      const catProducts = prods
        .filter((p) => p.category_id === cat.id)
        .map((p) => {
          const pImgs = imgs.filter((i) => i.product_id === p.id);
          const validImages = pImgs
            .map((i: any) => i.image_path)
            .filter((u: any) => typeof u === "string" && u.trim() !== "");

          return {
            id: p.id,
            name: p.name,
            price: Number(p.price),
            description: p.description ?? "",
            badge: p.badge || undefined,
            image: validImages[0] ?? "",
            images: validImages,
            categoryName: cat.name,
          };
        });

      return {
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji ?? "",
        description: cat.description ?? "",
        products: catProducts,
      };
    }).filter((c) => c.products.length > 0);

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


