import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import logo from "@/assets/tinkerfly-logo.jpeg";

const staticLinks = [
  { label: "Home", href: "#hero" },
  { label: "How to Order", href: "#how-to-order" },
  { label: "About Us", href: "#about-us" },
  { label: "Contact", href: "#contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollectionsOpen, setDesktopCollectionsOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: settings } = useSiteSettings();

  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      // Local Storage check first
      const cStr = localStorage.getItem("tinkerfly_categories");
      const pStr = localStorage.getItem("tinkerfly_products");
      
      if (cStr && pStr) {
        const cats = JSON.parse(cStr).filter((c: any) => c.is_active !== false);
        const prods = JSON.parse(pStr).filter((p: any) => p.is_active !== false);
        
        // Only return categories that actually have active products
        const activeCats = cats.filter((c: any) => 
          prods.some((p: any) => p.category_id === c.id)
        ).sort((a: any, b: any) => a.sort_order - b.sort_order);
        
        if (activeCats.length > 0) return activeCats;
      }

      // Supabase Fallback
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const whatsappDirect = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}`
    : "https://wa.me/94722507196";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopCollectionsOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const scrollToCategory = (name: string) => {
    setDesktopCollectionsOpen(false);
    setMobileCollectionsOpen(false);
    setMobileOpen(false);
    const el = document.getElementById(`category-${name.replace(/\s+/g, "-").toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-header py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#hero" className="flex items-center gap-2">
          <img src={logo} alt="Tinkerfly" className="h-12 w-auto rounded-lg" />
        </a>

        <nav className="hidden md:flex items-center gap-7">
          <a href="#hero" className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300">
            Home
          </a>

          {/* Collections Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDesktopCollectionsOpen(!desktopCollectionsOpen)}
              className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 flex items-center gap-1"
            >
              Collections <ChevronDown size={14} className={`transition-transform duration-200 ${desktopCollectionsOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {desktopCollectionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 min-w-[220px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg overflow-hidden"
                >
                  {(categories ?? []).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.name)}
                      className="block w-full text-left px-5 py-3 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/60 transition-colors duration-200"
                    >
                      {cat.name}
                    </button>
                  ))}
                  {(!categories || categories.length === 0) && (
                    <div className="px-5 py-3 text-sm text-muted-foreground">No collections</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#how-to-order" className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300">
            How to Order
          </a>
          <a href="#about-us" className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300">
            About Us
          </a>
          <a href="#contact" className="nav-link text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300">
            Contact
          </a>
          <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm py-2.5 px-6">
            Order on WhatsApp
          </a>

        </nav>

        <button 
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setMobileCollectionsOpen(false); // Reset mobile collections when closing menu
          }} 
          className="md:hidden p-2 text-foreground"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <nav className="flex flex-col gap-1 p-4">
              <a href="#hero" onClick={() => setMobileOpen(false)} className="py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary rounded-btn transition-colors">
                Home
              </a>
              <div>
                <button
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="w-full py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary rounded-btn transition-colors flex items-center justify-between"
                >
                  Collections <ChevronDown size={14} className={`transition-transform ${mobileCollectionsOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {mobileCollectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4"
                    >
                      {(categories ?? []).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => scrollToCategory(cat.name)}
                          className="block w-full text-left py-2.5 px-4 text-sm text-foreground/70 hover:text-primary transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {staticLinks.filter(l => l.label !== "Home" && l.label !== "Collections").map((link) => (
                <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary rounded-btn transition-colors">
                  {link.label}
                </a>
              ))}
              <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-sm py-3 mt-2">
                Order on WhatsApp
              </a>

            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
