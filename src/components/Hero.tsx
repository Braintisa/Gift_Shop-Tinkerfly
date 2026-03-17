import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, Truck, Sparkles, Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import heroBouquet from "@/assets/hero-bouquet.jpg";

const ease = [0.23, 1, 0.32, 1] as const;

const Hero = () => {
  const { data: settings } = useSiteSettings();
  const whatsappDirect = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}`
    : "https://wa.me/94722507196";
  const title = settings?.hero_title || "Make Every Moment Magical with Bouquets";
  const subtitle = settings?.hero_subtitle || "Refined bouquet creations designed to elevate life's most meaningful celebrations.";
  const tagline = settings?.hero_tagline || "We Make Every Moment Special";

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Animated gradient orbs */}
      <div className="gradient-orb gradient-orb-green w-[500px] h-[500px] top-10 -left-32" />
      <div className="gradient-orb gradient-orb-gold w-[600px] h-[600px] -top-20 right-[-100px]" style={{ animationDelay: "4s" }} />
      <div className="gradient-orb gradient-orb-green w-72 h-72 bottom-10 left-1/4" style={{ animationDelay: "8s" }} />
      <div className="gradient-orb gradient-orb-gold w-96 h-96 top-1/3 right-1/4 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      {/* Gold radial glow behind hero image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(43 55% 53%), transparent 70%)" }} />

      <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-5"
            >
              {tagline}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.1] text-foreground mb-6 sm:mb-8"
            >
              {title.includes("Magical") ? (
                <>
                  Make Every Moment{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Magical
                  </span>{" "}
                  with Bouquets
                </>
              ) : (
                title
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14"
            >
              <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-order text-base !min-h-[48px] !py-3 !px-8">
                <MessageCircle size={20} /> Order Now on WhatsApp
              </a>
              <a href="#collections" className="btn-primary-brand text-base">
                <ExternalLink size={18} /> View Collections
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              className="flex flex-wrap gap-8 justify-center lg:justify-start"
            >
              {[
                { icon: Truck, label: "Islandwide Delivery" },
                { icon: Sparkles, label: "Custom Designs" },
                { icon: Star, label: "Premium Quality" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <badge.icon size={18} className="text-primary" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease }}
            className="relative flex justify-center"
          >
            <div className="relative">
              <img
                src={heroBouquet}
                alt="Elegant bouquet by Tinkerfly"
                className="w-full max-w-lg rounded-card shadow-2xl animate-float-slow"
                loading="eager"
              />
              <div className="absolute -inset-6 rounded-card bg-gradient-to-br from-brand-mint/15 to-brand-gold-soft/15 -z-10 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
