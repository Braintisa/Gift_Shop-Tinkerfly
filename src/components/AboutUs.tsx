import { motion } from "framer-motion";
import { Award, Truck, Sparkles } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBouquet from "@/assets/hero-bouquet.jpg";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const AboutUs = () => {
  const { data: settings } = useSiteSettings();
  const title = settings?.about_title || "About Tinkerfly";
  const heading = settings?.about_heading || "Elegant Bouquets for Every Occasion";
  const description = settings?.about_description || "At Tinkerfly, every occasion deserves thoughtful presentation. Our collection features carefully styled bouquet designs created for meaningful celebrations and memorable moments. Each arrangement is prepared with attention to balance, presentation, and detail, offering an elegant gifting experience supported by reliable islandwide delivery.";
  const image = settings?.about_image || heroBouquet;

  return (
    <section id="about-us" className="py-28 section-cream relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="relative w-full"
          >
            <div className="relative rounded-card overflow-hidden shadow-lg">
              <img
                src={image}
                alt="About Tinkerfly"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-mint/5 to-brand-gold-soft/5 pointer-events-none" />
            </div>
            {/* Glow effect behind */}
            <div className="absolute -inset-2 rounded-card bg-gradient-to-br from-brand-mint/20 to-brand-gold-soft/20 -z-10 blur-2xl opacity-60" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="relative z-20"
          >
            <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">{title}</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6 heading-accent">{heading}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>

            <div className="grid gap-5">
              {[
                { icon: Sparkles, title: "Carefully Styled", desc: "Each arrangement is designed with attention to detail and presentation" },
                { icon: Award, title: "Premium Quality", desc: "Refined materials and elegant styling in every bouquet" },
                { icon: Truck, title: "Islandwide Delivery", desc: "Reliable delivery across the entire island for every occasion" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50"
                    style={{ background: "linear-gradient(135deg, hsl(var(--brand-mint-light) / 0.5), hsl(var(--brand-gold-light) / 0.3))" }}>
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-0.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
