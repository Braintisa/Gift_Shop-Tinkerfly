import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fallbackTestimonials = [
  { id: "1", name: "Sachini Perera", role: "Bride-to-be", content: "Absolutely stunning bouquet! The attention to detail was incredible. Tinkerfly made my special day even more memorable.", rating: 5 },
  { id: "2", name: "Kavinda Fernando", role: "Anniversary Gift", content: "Ordered a rose bouquet for our anniversary — my wife was speechless! The delivery was prompt and the presentation was truly elegant.", rating: 5 },
  { id: "3", name: "Nimasha De Silva", role: "Birthday Surprise", content: "The bouquet was beyond beautiful. My best friend couldn't stop smiling. The quality and styling is unmatched.", rating: 5 },
  { id: "4", name: "Tharindu Jayasinghe", role: "Graduation Celebration", content: "Ordered for my sister's graduation — she loved it! Premium quality, refined design, and reliable islandwide delivery.", rating: 5 },
];

const Testimonials = () => {
  const { data: testimonials } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data && data.length > 0 ? data : fallbackTestimonials;
    },
  });

  const items = testimonials ?? fallbackTestimonials;

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
          {items.map((t: any, i: number) => (
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
