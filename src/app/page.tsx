"use client";

import { useQuery } from "@tanstack/react-query";
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
import type { Category, Product } from "@/lib/constants";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const fetchCatalog = async (): Promise<Category[]> => {
  const res = await fetch("/api/catalog");
  if (!res.ok) throw new Error("Failed to load catalog");
  return res.json();
};

const fetchPopular = async (): Promise<Product[]> => {
  const res = await fetch("/api/popular");
  if (!res.ok) throw new Error("Failed to load popular products");
  return res.json();
};

export default function HomePage() {
  const { data: settings } = useSiteSettings();
  const whatsappNumber = settings?.whatsapp_number || "94722507196";

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["public-categories"],
    queryFn: fetchCatalog,
  });

  const { data: popularProducts, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-products"],
    queryFn: fetchPopular,
  });

  return (
    <div className="min-h-screen bg-background/80 relative">
      <AmbientMist />
      <div className="relative z-10">
        <CustomCursor />
        <Header />
        <Hero />

        {loadingPopular ? null : popularProducts && popularProducts.length > 0 ? (
          <PopularSlider products={popularProducts} whatsappNumber={whatsappNumber} />
        ) : null}

        <div id="collections">
          {loadingCategories && (
            <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
              Loading collections...
            </div>
          )}
          {!loadingCategories && categories && categories.length > 0 && (
            <>
              {categories.map((cat, i) => (
                <CategorySection key={cat.id} category={cat} index={i} whatsappNumber={whatsappNumber} />
              ))}
            </>
          )}
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
}

