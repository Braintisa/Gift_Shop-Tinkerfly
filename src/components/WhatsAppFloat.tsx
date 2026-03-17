import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppFloat = () => {
  const { data: settings } = useSiteSettings();
  const whatsappDirect = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}`
    : "https://wa.me/94722507196";

  return (
    <>
      {/* Desktop floating button */}
      <a
        href={whatsappDirect}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        style={{
          backgroundColor: "hsl(var(--brand-whatsapp))",
          boxShadow: "0 6px 30px hsl(var(--brand-whatsapp) / 0.4)",
        }}
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
      </a>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/60 shadow-[0_-2px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}
      >
        <div className="px-3 pt-2 pb-1">
          <a href={whatsappDirect} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full py-3 text-base !min-h-[44px]">
            <MessageCircle size={20} /> Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind the sticky bar on mobile */}
      <div className="md:hidden h-[72px]" aria-hidden="true" />
    </>
  );
};

export default WhatsAppFloat;
