export const WHATSAPP_NUMBER = "94722507196";
export const WHATSAPP_DIRECT = "https://wa.me/94722507196";
export const WHATSAPP_CATALOGUE = "https://wa.me/c/94722507196";
export const PHONE = "+94 72 250 7196";
export const LOCATION_URL = "https://maps.app.goo.gl/ji7Xnz1HWJgAyDSb7?g_st=aw";
export const FACEBOOK_URL = "https://www.facebook.com/share/1ZmfzmjiVG/";
export const INSTAGRAM_URL = "https://www.instagram.com/tinkerfly_?igsh=MTlxejA5MGtldmZ4Nw==";
export const TIKTOK_URL = "https://www.tiktok.com/@tinkerfly__?_r=1&_t=ZS-948RviYPT4H";

export const getWhatsAppOrderLink = (productName: string, price: number, categoryName?: string, productUrl?: string) => {
  const message = `Hello, I want to order this bouquet:

Product: ${productName}
Price: Rs. ${price.toLocaleString()}${categoryName ? `\nCategory: ${categoryName}` : ""}${productUrl ? `\nProduct Link: ${productUrl}` : ""}

Please share availability and payment details.`;
  return `https://wa.me/94722507196?text=${encodeURIComponent(message)}`;
};

export const getWhatsAppOrderLinkWithNumber = (whatsappNumber: string, productName: string, price: number, categoryName?: string, productUrl?: string) => {
  const message = `Hello, I want to order this bouquet:

Product: ${productName}
Price: Rs. ${price.toLocaleString()}${categoryName ? `\nCategory: ${categoryName}` : ""}${productUrl ? `\nProduct Link: ${productUrl}` : ""}

Please share availability and payment details.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: "Most Popular" | "Premium" | "Luxury";
  image: string;
  images?: string[];
  categoryName?: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  products: Product[];
}

// Import category images for fallback display
import bouquetRoses from "@/assets/bouquet-roses.jpg";
import bouquetPremiumRoses from "@/assets/bouquet-premium-roses.jpg";
import bouquetFlowers from "@/assets/bouquet-flowers.jpg";
import bouquetGraduation from "@/assets/bouquet-graduation.jpg";
import bouquetTeddy from "@/assets/bouquet-teddy.jpg";
import bouquetChocolate from "@/assets/bouquet-chocolate.jpg";
import bouquetPhoto from "@/assets/bouquet-photo.jpg";

export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: "roses",
    name: "Roses Bouquets",
    emoji: "",
    description: "Classic elegance with carefully arranged roses in refined presentation",
    products: [
      { id: "rn1", name: "Classic Red Rose Bouquet", price: 3500, description: "Elegant arrangement of 12 red roses", badge: "Most Popular", image: bouquetRoses },
      { id: "rn2", name: "Pink Rose Delight", price: 4000, description: "Soft pink roses in a refined presentation", image: bouquetPremiumRoses },
      { id: "rn3", name: "White Rose Elegance", price: 3800, description: "Pure white roses styled with greenery", image: bouquetRoses },
      { id: "rn4", name: "Sunset Rose Bouquet", price: 4200, description: "Warm-toned roses in champagne wrapping", image: bouquetFlowers },
      { id: "rn5", name: "Mixed Rose Garden", price: 3700, description: "A beautiful mix of red, pink, and white roses", image: bouquetRoses },
    ],
  },
  {
    id: "premium-roses",
    name: "Premium Roses Bouquets",
    emoji: "",
    description: "Luxurious premium roses with exquisite styling for special occasions",
    products: [
      { id: "pr1", name: "Royal Red Premium Bouquet", price: 6500, description: "Luxurious premium red roses with satin ribbon", badge: "Luxury", image: bouquetPremiumRoses },
      { id: "pr2", name: "Grand Pink Premium", price: 7000, description: "Exquisite pink roses in premium gift box", badge: "Premium", image: bouquetPremiumRoses },
      { id: "pr3", name: "Ivory Premium Collection", price: 7500, description: "White premium roses with gold accent styling", image: bouquetRoses },
      { id: "pr4", name: "Signature Red & Gold", price: 8000, description: "Red roses with gold leaf detailing", badge: "Luxury", image: bouquetRoses },
    ],
  },
  {
    id: "flowers",
    name: "Flower Bouquets",
    emoji: "",
    description: "Elegant mixed arrangements for every occasion",
    products: [
      { id: "fb1", name: "Garden Mix Bouquet", price: 4500, description: "Colorful mixed arrangement for any occasion", badge: "Most Popular", image: bouquetFlowers },
      { id: "fb2", name: "Sunflower Delight", price: 4000, description: "Bright sunflower arrangement with greenery", image: bouquetFlowers },
      { id: "fb3", name: "Lavender Dreams", price: 4800, description: "Purple and lilac tones in soft wrapping", badge: "Premium", image: bouquetFlowers },
      { id: "fb4", name: "Pastel Paradise", price: 4300, description: "Soft pastel tones in elegant presentation", image: bouquetFlowers },
    ],
  },
  {
    id: "graduation",
    name: "Graduation Bouquets",
    emoji: "",
    description: "Celebrate achievements with specially designed graduation bouquets",
    products: [
      { id: "gd1", name: "Graduate Pride Bouquet", price: 4500, description: "Celebratory bouquet with graduation styling", badge: "Most Popular", image: bouquetGraduation },
      { id: "gd2", name: "Scholar Success", price: 5000, description: "Premium graduation bouquet with ribbon details", badge: "Premium", image: bouquetGraduation },
      { id: "gd3", name: "Cap & Gown Bouquet", price: 4800, description: "Themed arrangement celebrating achievement", image: bouquetGraduation },
      { id: "gd4", name: "Achievement Rose", price: 4200, description: "Red roses styled for graduation celebrations", image: bouquetRoses },
    ],
  },
  {
    id: "teddy",
    name: "Teddy Bouquets",
    emoji: "",
    description: "Adorable teddy bears paired with elegant bouquet arrangements",
    products: [
      { id: "tb1", name: "Teddy Love Bouquet", price: 5000, description: "Cute teddy bear with red rose arrangement", badge: "Most Popular", image: bouquetTeddy },
      { id: "tb2", name: "Mini Teddy Rose", price: 3500, description: "Small teddy with a single rose bouquet", image: bouquetTeddy },
      { id: "tb3", name: "Giant Teddy Arrangement", price: 7500, description: "Large teddy bear with premium bouquet", badge: "Luxury", image: bouquetTeddy },
      { id: "tb4", name: "Teddy & Chocolates", price: 5500, description: "Teddy bear paired with chocolates and roses", badge: "Premium", image: bouquetTeddy },
    ],
  },
  {
    id: "chocolate",
    name: "Chocolate Bouquets",
    emoji: "",
    description: "Sweet indulgence meets elegant presentation — the perfect gift",
    products: [
      { id: "cb1", name: "Choco Bliss Bouquet", price: 4000, description: "Assorted chocolates in elegant bouquet form", badge: "Most Popular", image: bouquetChocolate },
      { id: "cb2", name: "Ferrero Rocher Luxe", price: 5500, description: "Ferrero Rocher arranged in premium styling", badge: "Luxury", image: bouquetChocolate },
      { id: "cb3", name: "Sweet Rose Chocolate", price: 4800, description: "Roses combined with chocolate arrangement", badge: "Premium", image: bouquetChocolate },
      { id: "cb4", name: "Dark Chocolate Delight", price: 4200, description: "Dark chocolates in refined bouquet presentation", image: bouquetChocolate },
    ],
  },
  {
    id: "photo",
    name: "Photo Bouquets",
    emoji: "",
    description: "Personalize your bouquet with cherished photos and memories",
    products: [
      { id: "pb1", name: "Memory Lane Photo Bouquet", price: 5500, description: "Roses with custom photo prints in arrangement", badge: "Most Popular", image: bouquetPhoto },
      { id: "pb2", name: "Photo Frame Bouquet", price: 5000, description: "Bouquet with framed photo centerpiece", badge: "Premium", image: bouquetPhoto },
      { id: "pb3", name: "Polaroid Rose Bouquet", price: 4800, description: "Roses with polaroid-style photos", image: bouquetPhoto },
      { id: "pb4", name: "Custom Photo Heart", price: 6500, description: "Heart arrangement with personalized photos", badge: "Luxury", image: bouquetPhoto },
    ],
  },
];

export const POPULAR_PRODUCTS: Product[] = [
  { id: "pop1", name: "Classic Red Rose Bouquet", price: 3500, description: "Elegant arrangement of 12 red roses", badge: "Most Popular", image: bouquetRoses, categoryName: "Roses Bouquets" },
  { id: "pop2", name: "Royal Red Premium Bouquet", price: 6500, description: "Luxurious premium red roses with satin ribbon", badge: "Luxury", image: bouquetPremiumRoses, categoryName: "Premium Roses Bouquets" },
  { id: "pop3", name: "Garden Mix Bouquet", price: 4500, description: "Colorful mixed arrangement for any occasion", badge: "Most Popular", image: bouquetFlowers, categoryName: "Flower Bouquets" },
  { id: "pop4", name: "Graduate Pride Bouquet", price: 4500, description: "Celebratory bouquet with graduation styling", badge: "Most Popular", image: bouquetGraduation, categoryName: "Graduation Bouquets" },
  { id: "pop5", name: "Teddy Love Bouquet", price: 5000, description: "Cute teddy bear with red rose arrangement", badge: "Most Popular", image: bouquetTeddy, categoryName: "Teddy Bouquets" },
  { id: "pop6", name: "Choco Bliss Bouquet", price: 4000, description: "Assorted chocolates in elegant bouquet form", badge: "Most Popular", image: bouquetChocolate, categoryName: "Chocolate Bouquets" },
  { id: "pop7", name: "Memory Lane Photo Bouquet", price: 5500, description: "Roses with custom photo prints", badge: "Most Popular", image: bouquetPhoto, categoryName: "Photo Bouquets" },
];
