import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";

import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import CategoriesManager from "./pages/admin/CategoriesManager";
import ProductsManager from "./pages/admin/ProductsManager";
import TestimonialsManager from "./pages/admin/TestimonialsManager";
import SocialGalleryManager from "./pages/admin/SocialGalleryManager";
import SiteSettingsManager from "./pages/admin/SiteSettingsManager";
import AdminEmailsManager from "./pages/admin/AdminEmailsManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="categories" element={<CategoriesManager />} />
            <Route path="products" element={<ProductsManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="social-gallery" element={<SocialGalleryManager />} />
            <Route path="settings" element={<SiteSettingsManager />} />
            <Route path="admin-emails" element={<AdminEmailsManager />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
