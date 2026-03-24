/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Package, Image, Star, MessageSquare, Images, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardHome() {
  const [stats, setStats] = useState({ categories: 0, products: 0, images: 0, featured: 0, testimonials: 0, gallery: 0 });
  const { toast } = useToast();

  const loadStats = () => {
    fetch("/api/admin/dashboard-stats")
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data?.error || "Failed to load stats");
        setStats({
          categories: data.categories ?? 0,
          products: data.products ?? 0,
          images: data.images ?? 0,
          featured: data.featured ?? 0,
          testimonials: data.testimonials ?? 0,
          gallery: data.gallery ?? 0,
        });
      })
      .catch((err: any) => {
        toast({ title: "Failed to load dashboard stats", description: err.message, variant: "destructive" });
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    { label: "Categories", value: stats.categories, icon: FolderOpen, color: "text-primary", link: "/admin/categories" },
    { label: "Products", value: stats.products, icon: Package, color: "text-primary", link: "/admin/products" },
    { label: "Featured", value: stats.featured, icon: Star, color: "text-brand-gold", link: "/admin/products" },
    { label: "Product Images", value: stats.images, icon: Image, color: "text-brand-gold", link: "/admin/products" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-primary", link: "/admin/testimonials" },
    { label: "Gallery Items", value: stats.gallery, icon: Images, color: "text-brand-gold", link: "/admin/social-gallery" },
  ];

  const go = (link: string) => {
    // Only navigate on the client; Next.js prerender/build has no router context.
    if (typeof window !== "undefined") window.location.href = link;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-bold">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => go(c.link)}>
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

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => go("/admin/settings")}>
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
