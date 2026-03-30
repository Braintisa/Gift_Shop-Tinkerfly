import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "./ProductCard";
import { POPULAR_PRODUCTS, type Product } from "@/lib/constants";

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface PopularSliderProps {
  products?: Product[];
  whatsappNumber?: string;
}

const PopularSlider = ({ products, whatsappNumber }: PopularSliderProps) => {
  const items = products && products.length > 0 ? products : POPULAR_PRODUCTS;

  return (
    <section className="py-28 section-premium relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--brand-gold)), transparent 70%)" }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-4">Bestsellers</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1 heading-accent">
            Most Popular Bouquets
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4">
            Our best-selling arrangements loved by customers across the island
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {items.map((product, i) => (
                <CarouselItem key={product.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <ProductCard product={product} index={i} whatsappNumber={whatsappNumber} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="flex left-2 sm:-left-4 md:-left-6 h-9 w-9 sm:h-10 sm:w-10 border-border/50 bg-card/90 backdrop-blur-sm hover:bg-card shadow-md" />
            <CarouselNext className="flex right-2 sm:-right-4 md:-right-6 h-9 w-9 sm:h-10 sm:w-10 border-border/50 bg-card/90 backdrop-blur-sm hover:bg-card shadow-md" />
          </Carousel>
          <p className="sm:hidden mt-4 text-center text-xs text-muted-foreground">
            Swipe left or right, or tap arrows to see more products.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularSlider;
