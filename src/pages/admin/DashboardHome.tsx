import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Package, Image, Star, MessageSquare, Images, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardHome() {
  const [stats, setStats] = useState({ categories: 0, products: 0, images: 0, featured: 0, testimonials: 0, gallery: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const [c, p, i, f, t, g] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("product_images").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("is_featured", true),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("social_gallery").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        categories: c.count ?? 0,
        products: p.count ?? 0,
        images: i.count ?? 0,
        featured: f.count ?? 0,
        testimonials: t.count ?? 0,
        gallery: g.count ?? 0,
      });
    };
    load();
  }, []);

  const cards = [
    { label: "Categories", value: stats.categories, icon: FolderOpen, color: "text-primary", link: "/admin/categories" },
    { label: "Products", value: stats.products, icon: Package, color: "text-primary", link: "/admin/products" },
    { label: "Featured", value: stats.featured, icon: Star, color: "text-brand-gold", link: "/admin/products" },
    { label: "Product Images", value: stats.images, icon: Image, color: "text-brand-gold", link: "/admin/products" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-primary", link: "/admin/testimonials" },
    { label: "Gallery Items", value: stats.gallery, icon: Images, color: "text-brand-gold", link: "/admin/social-gallery" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold">Dashboard Overview</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(c.link)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/admin/settings")}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Site Settings</CardTitle>
          <Settings className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Manage WhatsApp number, contact info, hero text, about us, social links, and more</p>
        </CardContent>
      </Card>
    </div>
  );
}
