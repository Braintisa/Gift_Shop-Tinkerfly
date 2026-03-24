import { motion } from "framer-motion";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const ContactFooter = () => {
  const { data: settings } = useSiteSettings();
  const whatsappNumber = settings?.whatsapp_number || "94722507196";
  const phone = settings?.phone || "+94 72 250 7196";
  const address = settings?.address || "Nagoda, Kaluthara";
  const mapsLink = settings?.google_maps_link || "https://maps.app.goo.gl/ji7Xnz1HWJgAyDSb7?g_st=aw";
  const footerTagline = settings?.footer_tagline || "We Make Every Moment Special";
  const facebookUrl = settings?.facebook_url || "https://www.facebook.com/share/1ZmfzmjiVG/";
  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/tinkerfly_";
  const tiktokUrl = settings?.tiktok_url || "https://www.tiktok.com/@tinkerfly__";

  const socialLinks = [
    {
      label: "Facebook",
      href: facebookUrl,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    },
    {
      label: "Instagram",
      href: instagramUrl,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    },
    {
      label: "TikTok",
      href: tiktokUrl,
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13v-3.5a6.37 6.37 0 0 0-.88-.07A6.27 6.27 0 0 0 3.22 15.2a6.27 6.27 0 0 0 6.27 6.27 6.27 6.27 0 0 0 6.27-6.27V9.34a8.16 8.16 0 0 0 4.83 1.56V7.42a4.85 4.85 0 0 1-1-.73z"/></svg>,
    },
  ];

  const contactCards = [
    { href: `https://wa.me/${whatsappNumber}`, target: "_blank", icon: MessageCircle, iconClass: "text-brand-whatsapp", title: "WhatsApp", sub: phone },
    { href: `tel:${phone.replace(/\s/g, "")}`, target: undefined as undefined, icon: Phone, iconClass: "text-primary", title: "Call Us", sub: phone },
    { href: mapsLink, target: "_blank", icon: MapPin, iconClass: "text-accent", title: "Visit Us", sub: address },
  ];

  return (
    <>
      <section id="contact" className="py-28 section-premium relative">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--brand-mint)), transparent 70%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Reach Out</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">Get in Touch</h2>
            <p className="text-muted-foreground mt-4">We'd love to hear from you</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
            {contactCards.map((c) => (
              <motion.a
                key={c.title}
                href={c.href}
                target={c.target}
                rel={c.target ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="card-luxury p-7 text-center"
              >
                <c.icon className={`mx-auto mb-3 ${c.iconClass}`} size={32} />
                <h3 className="font-display font-semibold text-foreground mb-1">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.sub}</p>
                {c.title === "Visit Us" && (
                  <p className="text-xs text-primary mt-2 font-medium">Open in Google Maps →</p>
                )}
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">Follow Us On Social Media</p>
            <div className="flex justify-center gap-5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-icon-btn group">
                  <span className="text-foreground/60 group-hover:text-primary transition-colors duration-300">{s.icon}</span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 mt-1.5">{s.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="section-dark py-14 relative">
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--brand-gold) / 0.15), transparent 90%)" }} />
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <img src="/logo.png" alt="Tinkerfly" className="h-16 rounded-xl" />
            <p className="text-white/50 font-display italic text-lg">"{footerTagline}"</p>
            <div className="flex gap-5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="text-white/40 hover:text-white transition-colors duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
            <p className="text-white/25 text-xs">&copy; {new Date().getFullYear()} Tinkerfly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ContactFooter;
