import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const Testimonials = () => {
  const { data: testimonials } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to load testimonials");
      return (await res.json()) as Testimonial[];
    },
  });

  const items = (testimonials ?? []) as Testimonial[];

  // If there is no real data in MySQL, don't show dummy content.
  if (!items || items.length === 0) return null;

  return (
    <section className="py-28 section-premium relative">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full opacity-[0.03] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-gold-soft)), transparent 70%)" }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Trusted by hundreds of happy customers across the island
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((t: Testimonial, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              className="card-luxury p-8 relative"
            >
              <Quote size={40} className="absolute top-6 right-6 opacity-[0.06]" style={{ color: "hsl(var(--brand-gold))" }} />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-current" style={{ color: "hsl(var(--brand-gold))" }} />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 text-[15px] italic">"{t.content}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--brand-mint-light)), hsl(var(--brand-gold-light)))",
                    color: "hsl(var(--brand-mint-deep))",
                  }}
                >
                  {(t.name || "?").split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
