import { NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

type UploadResult = {
  hero_image_1?: string;
  hero_image_2?: string;
};

function getExtFromFile(file: File) {
  // Prefer declared MIME type
  const type = file.type?.toLowerCase() ?? "";
  if (type.includes("jpeg")) return "jpeg";
  if (type.includes("jpg")) return "jpg";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";

  // Fallback: try from file name
  const name = file.name ?? "";
  const dot = name.lastIndexOf(".");
  if (dot !== -1 && dot < name.length - 1) return name.slice(dot + 1).toLowerCase();

  return "jpeg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const hero1 = formData.get("hero1");
    const hero2 = formData.get("hero2");

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const result: UploadResult = {};

    const saveOne = async (key: "hero1" | "hero2", fileValue: FormDataEntryValue | null) => {
      if (!(fileValue instanceof File)) return;
      if (!fileValue.type?.startsWith("image/")) return;

      const ext = getExtFromFile(fileValue);
      const ts = Date.now();
      const filename = `${key}-${ts}.${ext}`;
      const filepath = path.join(uploadsDir, filename);

      const arrayBuffer = await fileValue.arrayBuffer();
      await writeFile(filepath, Buffer.from(arrayBuffer));

      const url = `/uploads/${filename}`;
      if (key === "hero1") result.hero_image_1 = url;
      if (key === "hero2") result.hero_image_2 = url;
    };

    await saveOne("hero1", hero1);
    await saveOne("hero2", hero2);

    if (!result.hero_image_1 && !result.hero_image_2) {
      return NextResponse.json({ error: "No image files found" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Upload failed" }, { status: 500 });
  }
}

