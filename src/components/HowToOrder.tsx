import { motion } from "framer-motion";
import { Search, MessageCircle, CreditCard, Truck } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const steps = [
  { icon: Search, title: "Choose Your Bouquet", description: "Browse our bouquet collections" },
  { icon: MessageCircle, title: "Message on WhatsApp", description: "Send us your selection instantly" },
  { icon: CreditCard, title: "Confirm & Transfer", description: "Confirm design & pay via bank transfer" },
  { icon: Truck, title: "Islandwide Delivery", description: "Your bouquet delivered with care for every special occasion" },
];

const HowToOrder = () => {
  const { data: settings } = useSiteSettings();
  const whatsappDirect = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}`
    : "https://wa.me/94722507196";

  return (
    <section id="how-to-order" className="py-28 section-cream relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">How to Order</h2>
          <p className="text-muted-foreground mt-4">Four simple steps to get your bouquet</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center relative border border-border/50 group-hover:border-primary/20 transition-all duration-500"
                style={{ background: "linear-gradient(135deg, hsl(var(--brand-mint-light) / 0.5), hsl(var(--brand-gold-light) / 0.3))" }}>
                <s.icon size={28} className="text-primary" />
                <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--brand-mint-deep)), hsl(var(--brand-gold-muted)))", color: "white" }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center"
        >
          <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-lg !py-4 !px-10">
            <MessageCircle size={22} /> Start Your Order Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowToOrder;
