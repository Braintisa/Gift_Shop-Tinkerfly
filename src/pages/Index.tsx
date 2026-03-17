import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import PopularSlider from "@/components/PopularSlider";
import WhyChoose from "@/components/WhyChoose";
import HowToOrder from "@/components/HowToOrder";
import AboutUs from "@/components/AboutUs";
import SocialFeed from "@/components/SocialFeed";
import Testimonials from "@/components/Testimonials";
import ContactFooter from "@/components/ContactFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CustomCursor from "@/components/CustomCursor";
import AmbientMist from "@/components/AmbientMist";
import { SAMPLE_CATEGORIES, POPULAR_PRODUCTS, type Category, type Product } from "@/lib/constants";

const Index = () => {
  const { data: settings } = useSiteSettings();
  const whatsappNumber = settings?.whatsapp_number || "94722507196";

  const { data: categories } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      // Local Storage JSON Fetch first
      const pStr = localStorage.getItem("tinkerfly_products");
      const cStr = localStorage.getItem("tinkerfly_categories");
      const iStr = localStorage.getItem("tinkerfly_product_images");

      if (cStr && pStr) {
        const cats = JSON.parse(cStr).filter((c: any) => c.is_active !== false).sort((a: any, b: any) => a.sort_order - b.sort_order);
        const prods = JSON.parse(pStr).filter((p: any) => p.is_active !== false).sort((a: any, b: any) => a.sort_order - b.sort_order);
        const imgs = iStr ? JSON.parse(iStr) : [];
        if (cats.length > 0) {
          const mapped: Category[] = cats.map((c: any) => ({
            id: c.id,
            name: c.name,
            emoji: c.emoji || "",
            description: c.description || "",
            products: prods
              .filter((p: any) => p.category_id === c.id)
              .map((p: any) => {
                const pImgs = imgs.filter((i: any) => i.product_id === p.id).sort((a: any, b: any) => a.sort_order - b.sort_order);
                return {
                  id: p.id,
                  name: p.name,
                  price: Number(p.price),
                  description: p.description || "",
                  badge: p.badge as any,
                  image: pImgs[0]?.image_path || "",
                  images: pImgs.map((i: any) => i.image_path),
                  categoryName: c.name,
                };
              }),
          }));
          const filtered = mapped.filter((c) => c.products.length > 0);
          if (filtered.length > 0) return filtered;
        }
      }

      // Supabase Fallback
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!cats || cats.length === 0) return SAMPLE_CATEGORIES;

      const { data: products } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("is_active", true)
        .order("sort_order");

      const mapped: Category[] = cats.map((c) => ({
        id: c.id,
        name: c.name,
        emoji: c.emoji,
        description: c.description || "",
        products: (products || [])
          .filter((p) => p.category_id === c.id)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            description: p.description || "",
            badge: p.badge as any,
            image: p.product_images?.[0]?.image_path || "",
            images: p.product_images?.map((i: any) => i.image_path) || [],
            categoryName: c.name,
          })),
      }));

      return mapped.filter((c) => c.products.length > 0);
    },
  });

  const { data: popularProducts } = useQuery({
    queryKey: ["popular-products"],
    queryFn: async () => {
      // Local Storage JSON Fetch
      const pStr = localStorage.getItem("tinkerfly_products");
      const cStr = localStorage.getItem("tinkerfly_categories");
      const iStr = localStorage.getItem("tinkerfly_product_images");

      if (pStr && cStr) {
        const cats = JSON.parse(cStr);
        const prods = JSON.parse(pStr)
          .filter((p: any) => p.is_active !== false && p.is_featured === true)
          .sort((a: any, b: any) => a.sort_order - b.sort_order);
        const imgs = iStr ? JSON.parse(iStr) : [];

        if (prods.length > 0) {
          return prods.map((p: any) => {
            const pImgs = imgs.filter((i: any) => i.product_id === p.id).sort((a: any, b: any) => a.sort_order - b.sort_order);
            const cat = cats.find((c: any) => c.id === p.category_id);
            return {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              description: p.description || "",
              badge: p.badge as any,
              image: pImgs[0]?.image_path || "",
              images: pImgs.map((i: any) => i.image_path),
              categoryName: cat?.name || "",
            } as Product;
          });
        }
      }

      // Supabase Fallback
      const { data } = await supabase
        .from("products")
        .select("*, product_images(*), categories!inner(name)")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order");

      if (!data || data.length === 0) return POPULAR_PRODUCTS;

      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        description: p.description || "",
        badge: p.badge as any,
        image: p.product_images?.[0]?.image_path || "",
        images: p.product_images?.map((i: any) => i.image_path) || [],
        categoryName: p.categories?.name || "",
      })) as Product[];
    },
  });

  const displayCategories = categories || SAMPLE_CATEGORIES;
  const displayPopular = popularProducts || POPULAR_PRODUCTS;

  return (
    <div className="min-h-screen bg-background/80 relative">
      <AmbientMist />
      <div className="relative z-10">
        <CustomCursor />
        <Header />
        <Hero />

        <PopularSlider products={displayPopular} whatsappNumber={whatsappNumber} />

        <div id="collections">
          {displayCategories.map((cat, i) => (
            <CategorySection key={cat.id} category={cat} index={i} whatsappNumber={whatsappNumber} />
          ))}
        </div>
        <WhyChoose />
        <HowToOrder />
        <AboutUs />
        <SocialFeed />
        <Testimonials />
        <ContactFooter />
        <WhatsAppFloat />
      </div>
    </div>
  );
};

export default Index;
