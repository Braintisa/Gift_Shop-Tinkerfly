import { motion } from "framer-motion";
import { Heart, Truck, Star, Shield } from "lucide-react";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const features = [
  { icon: Heart, title: "Prepared with Care", description: "Every bouquet is carefully arranged with attention to balance and presentation" },
  { icon: Truck, title: "Islandwide Delivery", description: "Reliable delivery service across the entire island for every occasion" },
  { icon: Star, title: "Premium Quality", description: "Refined materials and elegant styling in every arrangement" },
  { icon: Shield, title: "Satisfaction Guaranteed", description: "We ensure every order meets the highest standards of quality" },
];

const WhyChoose = () => (
  <section className="section-dark py-28 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--brand-gold) / 0.2), transparent 90%)" }} />
    
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none blur-3xl"
      style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)), transparent 70%)" }} />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease }}
        className="text-center mb-16"
      >
        <p className="text-sm font-medium tracking-[0.25em] uppercase mb-4"
          style={{ color: "hsl(var(--brand-gold-soft))" }}>Our Promise</p>
        <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2 heading-accent">Why Choose Tinkerfly</h2>
        <p className="text-white/50 max-w-xl mx-auto mt-4">Thoughtful presentation and refined quality in every arrangement we create.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.06] flex items-center justify-center backdrop-blur-sm border border-white/[0.08] group-hover:border-white/[0.15] transition-all duration-500 group-hover:bg-white/[0.1]">
              <f.icon size={28} className="text-brand-mint" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-white/45 text-sm leading-relaxed">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChoose;
