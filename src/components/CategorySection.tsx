import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { type Category } from "@/lib/constants";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const CategorySection = ({ category, index, whatsappNumber }: { category: Category; index: number; whatsappNumber?: string }) => {
  const isAlt = index % 2 === 1;
  const sectionId = `category-${category.name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section id={sectionId} className={`py-28 relative overflow-hidden ${isAlt ? "section-cream" : "section-mint"}`}>
      {/* Animated background orbs */}
      <div className="gradient-orb gradient-orb-green w-96 h-96 -top-20 -left-20" style={{ animationDelay: `${index * 3}s` }} />
      <div className="gradient-orb gradient-orb-gold w-80 h-80 bottom-0 right-0" style={{ animationDelay: `${index * 3 + 5}s` }} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Collection</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">{category.name}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">{category.description}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-7">
          {category.products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
