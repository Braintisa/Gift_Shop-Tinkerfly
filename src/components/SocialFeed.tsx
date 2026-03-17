import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBouquet from "@/assets/hero-bouquet.jpg";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fallbackPosts = [
  { id: "1", image_url: heroBouquet, caption: "Elegant bouquet designs for special moments", link_url: "" },
  { id: "2", image_url: heroBouquet, caption: "Styled arrangements for meaningful celebrations", link_url: "" },
  { id: "3", image_url: heroBouquet, caption: "Celebrate with Tinkerfly bouquets", link_url: "" },
  { id: "4", image_url: heroBouquet, caption: "Premium quality presentation", link_url: "" },
  { id: "5", image_url: heroBouquet, caption: "Thoughtfully prepared for every occasion", link_url: "" },
  { id: "6", image_url: heroBouquet, caption: "Islandwide delivery — elegant and refined", link_url: "" },
];

const SocialFeed = () => {
  const { data: settings } = useSiteSettings();
  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/tinkerfly_";
  const facebookUrl = settings?.facebook_url || "https://www.facebook.com/share/1ZmfzmjiVG/";
  const tiktokUrl = settings?.tiktok_url || "https://www.tiktok.com/@tinkerfly__";

  const { data: galleryItems } = useQuery({
    queryKey: ["public-gallery"],
    queryFn: async () => {
      // Local Storage JSON Fetch first
      const raw = localStorage.getItem("tinkerfly_social_gallery");
      if (raw) {
        let parsed = JSON.parse(raw);
        parsed = parsed.filter((i: any) => i.is_active !== false).sort((a: any, b: any) => a.sort_order - b.sort_order);
        if (parsed.length > 0) return parsed;
      }

      // Supabase Fallback
      const { data } = await supabase
        .from("social_gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data && data.length > 0 ? data : fallbackPosts;
    },
  });

  const posts = galleryItems ?? fallbackPosts;

  return (
    <section className="py-28 section-cream relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Follow Us</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">
            From Our Social Gallery
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Stay inspired — follow us for bouquet inspiration and behind-the-scenes moments
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-12">
          {posts.map((post: any, i: number) => (
            <motion.a
              key={post.id}
              href={post.link_url || instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease }}
              className="group relative overflow-hidden aspect-square"
              style={{ borderRadius: 18 }}
            >
              <img
                src={post.image_url || heroBouquet}
                alt={post.caption || "Gallery"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                <p className="text-white text-sm leading-snug line-clamp-2">{post.caption}</p>
              </div>
              <div
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                style={{ background: "hsl(0 0% 100% / 0.2)" }}
              >
                <ExternalLink size={14} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-brand text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            Follow on Instagram
          </a>
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-brand text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Follow on Facebook
          </a>
          <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-brand text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07A6.27 6.27 0 0 0 3.22 15.2a6.27 6.27 0 0 0 6.27 6.27 6.27 6.27 0 0 0 6.27-6.27V9.34a8.16 8.16 0 0 0 4.83 1.56V7.42a4.85 4.85 0 0 1-1-.73z"/></svg>
            Follow on TikTok
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialFeed;
