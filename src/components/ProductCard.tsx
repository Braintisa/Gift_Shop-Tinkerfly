import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import { getWhatsAppOrderLink, getWhatsAppOrderLinkWithNumber, type Product } from "@/lib/constants";
import heroBouquet from "@/assets/hero-bouquet.jpg";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProductCardProps {
  product: Product;
  index: number;
  whatsappNumber?: string;
}

const badgeClass: Record<string, string> = {
  "Most Popular": "badge-popular",
  Premium: "badge-premium",
  Luxury: "badge-luxury",
};

const ease: [number, number, number, number] = [0.23, 1, 0.32, 1];

const ProductCard = ({ product, index, whatsappNumber }: ProductCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    if (!modalOpen) setIsZoomed(false);
  }, [modalOpen]);

  // Use a stable relative URL to avoid SSR/client hydration mismatches.
  const productUrl = `/?product=${product.id}`;

  const orderLink = whatsappNumber
    ? getWhatsAppOrderLinkWithNumber(whatsappNumber, product.name, product.price, product.categoryName, productUrl)
    : getWhatsAppOrderLink(product.name, product.price, product.categoryName, productUrl);

  // Ensure images is always an array of valid strings
  const rawImages = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];
  
  // Filter out any empty strings and provide fallback
  const images = rawImages.filter(img => typeof img === 'string' && img.trim() !== "").length > 0
    ? rawImages.filter(img => typeof img === 'string' && img.trim() !== "")
    : [heroBouquet];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease }}
        className="card-product group relative cursor-pointer"
        onClick={() => { setImgIdx(0); setModalOpen(true); }}
      >
        {product.badge && <span className={badgeClass[product.badge]}>{product.badge}</span>}

        <div className="relative overflow-hidden aspect-[4/5]" style={{ borderRadius: "18px 18px 0 0" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-mint-light/20 via-background/60 to-brand-gold-light/20 z-0" />
          <img
            src={images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] relative z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        </div>

        <div className="p-3 sm:p-5 flex flex-col gap-1">
          <h3 className="font-display font-semibold text-xs sm:text-base text-card-foreground line-clamp-1">{product.name}</h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{product.description}</p>
          <p className="text-sm sm:text-lg font-semibold text-muted-foreground mt-1">Rs. {product.price.toLocaleString()}</p>

            <div className="flex gap-2 mt-2">
            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-order flex-1 text-[11px] sm:text-sm !min-h-[36px] sm:!min-h-[40px] !py-1.5 sm:!py-2 !px-3 sm:!px-5 cursor-pointer"
            >
              <MessageCircle size={14} /> Order
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setImgIdx(0);
                setModalOpen(true);
              }}
              className="hidden sm:flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
              style={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
            >
              <Eye size={14} /> Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product Detail Modal using Portal-friendly Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden border-none bg-transparent shadow-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease }}
            className="relative bg-card w-full overflow-hidden shadow-2xl border border-border/40 max-h-[85vh] flex flex-col cursor-pointer"
            style={{ borderRadius: 20 }}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 z-[30] w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-md sm:w-10 sm:h-10 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Image section — controlled size with cursor-zoom */}
            <div className="relative w-full shrink-0" style={{ maxHeight: "45vh" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-mint-light/15 via-transparent to-brand-gold-light/15 z-0" />
              <div
                className="relative w-full h-full overflow-hidden cursor-zoom-in touch-none"
                style={{ aspectRatio: "4/3", maxHeight: "45vh" }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setIsZoomed(true);
                }}
                onPointerLeave={() => {
                  setIsZoomed(false);
                  setZoomOrigin({ x: 50, y: 50 });
                }}
                onPointerDown={() => {
                  // Supports touch/pen: zoom while user is pressing.
                  setIsZoomed(true);
                }}
                onPointerUp={() => {
                  setIsZoomed(false);
                  setZoomOrigin({ x: 50, y: 50 });
                }}
                onPointerCancel={() => {
                  setIsZoomed(false);
                  setZoomOrigin({ x: 50, y: 50 });
                }}
                onPointerMove={(e) => {
                  if (!isZoomed) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin({
                    x: Math.min(100, Math.max(0, x)),
                    y: Math.min(100, Math.max(0, y)),
                  });
                }}
              >
                <img
                  src={images[imgIdx] || heroBouquet}
                  alt={product.name}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: isZoomed ? "scale(1.7)" : "scale(1)",
                  }}
                />
              </div>
              {product.badge && (
                <span className={`${badgeClass[product.badge]} !top-3 !left-3 z-20 !text-[10px] !px-2.5 !py-0.5`}>{product.badge}</span>
              )}
              {/* Image nav arrows if multiple */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p - 1 + images.length) % images.length); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIdx((p) => (p + 1) % images.length); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                    {images.map((_, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/40"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Content section */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {product.categoryName && (
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-brand-gold-muted mb-2">{product.categoryName}</p>
              )}
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1.5">{product.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{product.description}</p>

              <div className="flex items-center justify-between gap-4">
                <p className="text-xl sm:text-2xl font-semibold text-muted-foreground">Rs. {product.price.toLocaleString()}</p>
                <a
                  href={orderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-order text-sm shrink-0 cursor-pointer"
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
