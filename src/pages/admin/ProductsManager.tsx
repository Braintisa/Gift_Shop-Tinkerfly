import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star, Search, Upload, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type Category = Tables<"categories">;
type ProductImage = Tables<"product_images">;

const BADGE_OPTIONS = [
  { value: "none", label: "No Badge" },
  { value: "Most Popular", label: "Most Popular" },
  { value: "Premium", label: "Premium" },
  { value: "Luxury", label: "Luxury" },
];

const defaultForm = {
  name: "", description: "", price: 0, category_id: "", badge: "none",
  is_featured: false, is_active: true, customizable: false, sort_order: 0,
};

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filterCat, setFilterCat] = useState("all");
  const [filterActive, setFilterActive] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    const [p, c, i] = await Promise.all([
      supabase.from("products").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("product_images").select("*").order("sort_order"),
    ]);
    setProducts(p.data ?? []);
    setCategories(c.data ?? []);
    setProductImages(i.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const getProductImages = (productId: string) => productImages.filter(i => i.product_id === productId);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...defaultForm, sort_order: products.length, category_id: categories[0]?.id ?? "" });
    setPendingImages([]);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description ?? "", price: p.price,
      category_id: p.category_id, badge: p.badge ?? "none",
      is_featured: p.is_featured, is_active: p.is_active,
      customizable: p.customizable, sort_order: p.sort_order,
    });
    setPendingImages(getProductImages(p.id).map(i => i.image_path));
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const path = `products/${Date.now()}-${idx}-${file.name}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); continue; }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
    setPendingImages(prev => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removePendingImage = (url: string) => {
    setPendingImages(prev => prev.filter(u => u !== url));
  };

  const handleSave = async () => {
    const payload = {
      name: form.name, description: form.description || null, price: form.price,
      category_id: form.category_id, badge: form.badge === "none" ? null : form.badge,
      is_featured: form.is_featured, is_active: form.is_active,
      customizable: form.customizable, sort_order: form.sort_order,
    };
    let productId = editing?.id;

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { data, error } = await supabase.from("products").insert(payload).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      productId = data.id;
    }

    // Sync images
    if (productId) {
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (pendingImages.length > 0) {
        const imageRows = pendingImages.map((url, idx) => ({
          product_id: productId!,
          image_path: url,
          sort_order: idx,
        }));
        await supabase.from("product_images").insert(imageRows);
      }
    }

    toast({ title: editing ? "Product updated" : "Product created" });
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("product_images").delete().eq("product_id", id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Product deleted" });
    fetchData();
  };

  const toggleFeatured = async (p: Product) => {
    await supabase.from("products").update({ is_featured: !p.is_featured }).eq("id", p.id);
    fetchData();
  };

  const toggleActive = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    fetchData();
  };

  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  let filtered = products;
  if (filterCat !== "all") filtered = filtered.filter(p => p.category_id === filterCat);
  if (filterActive === "active") filtered = filtered.filter(p => p.is_active);
  if (filterActive === "inactive") filtered = filtered.filter(p => !p.is_active);
  if (filterFeatured === "featured") filtered = filtered.filter(p => p.is_featured);
  if (searchQuery) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display font-bold">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (LKR)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm(f => ({ ...f, category_id: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Select value={form.badge} onValueChange={(v) => setForm(f => ({ ...f, badge: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BADGE_OPTIONS.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Images</Label>
                {pendingImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingImages.map((url, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removePendingImage(url)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <Input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v }))} />
                  <Label>Featured / Popular</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm(f => ({ ...f, is_active: v }))} />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.customizable} onCheckedChange={(v) => setForm(f => ({ ...f, customizable: v }))} />
                  <Label>Customizable</Label>
                </div>
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!form.name || !form.category_id}>
                {editing ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterActive} onValueChange={setFilterActive}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterFeatured} onValueChange={setFilterFeatured}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Featured" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="featured">Featured Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const imgs = getProductImages(p.id);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      {imgs.length > 0 ? (
                        <img src={imgs[0].image_path} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{getCatName(p.category_id)}</TableCell>
                    <TableCell>Rs. {p.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {p.badge ? <Badge variant="secondary">{p.badge}</Badge> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleFeatured(p)}>
                        <Star className={`h-4 w-4 ${p.is_featured ? "fill-current text-brand-gold" : "text-muted-foreground"}`} />
                      </button>
                    </TableCell>
                    <TableCell><Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} /></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No products found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
