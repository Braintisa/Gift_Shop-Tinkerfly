import { useEffect, useState } from "react";
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
import { Plus, Pencil, Trash2, Star, Search, Upload, X, Loader2 } from "lucide-react";

type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  badge: string | null;
  is_featured: boolean;
  is_active: boolean;
  customizable: boolean;
  sort_order: number;
};

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_path: string;
  sort_order: number;
};

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
  const [saving, setSaving] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes, imgsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
        fetch("/api/admin/product-images"),
      ]);

      if (!catsRes.ok || !prodsRes.ok || !imgsRes.ok) {
        const msg = await Promise.resolve(
          (await (catsRes.ok ? prodsRes : catsRes).json().catch(() => ({})))?.error
        );
        throw new Error(msg || "Failed to load catalog data");
      }

      const cats = await catsRes.json();
      const prods = await prodsRes.json();
      const imgs = await imgsRes.json();

      setCategories(cats ?? []);
      setProducts(prods ?? []);
      setProductImages(imgs ?? []);
    } catch (err: any) {
      toast({ title: "Failed to load catalog data", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
    try {
      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const formData = new FormData();
        formData.append("key", "d780a2a4ef3db8699ca4d25a35c8d49a");
        formData.append("image", file);

        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        const url = data?.success ? data?.data?.url : null;
        if (typeof url === "string" && url.trim() !== "") newUrls.push(url);
        else {
          toast({
            title: "Upload failed",
            description: data?.error?.message || "Invalid upload response",
            variant: "destructive",
          });
        }
      }
      if (newUrls.length > 0) {
        setPendingImages(prev => [...prev, ...newUrls]);
      }
    } catch (err: any) {
      toast({ title: "Upload error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
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
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/products/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, images: pendingImages }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to update product");
      } else {
        const res = await fetch(`/api/admin/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, images: pendingImages }),
        });
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to create product");
      }

      toast({ title: editing ? "Product updated" : "Product created" });
      setDialogOpen(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Delete failed");
      toast({ title: "Product deleted" });
      fetchData();
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const toggleFeatured = async (p: Product) => {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !p.is_featured }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Update failed", description: data.error || "Failed to update", variant: "destructive" });
      return;
    }
    fetchData();
  };

  const toggleActive = async (p: Product) => {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ title: "Update failed", description: data.error || "Failed to update", variant: "destructive" });
      return;
    }
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
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Product</Button>
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
                  <Select value={form.category_id || undefined} onValueChange={(v) => setForm(f => ({ ...f, category_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select a Category..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Select value={form.badge} onValueChange={(v) => setForm(f => ({ ...f, badge: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select or type..." /></SelectTrigger>
                    <SelectContent>
                      {BADGE_OPTIONS.map((b) => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Or type a custom badge..." 
                    value={form.badge === "none" ? "" : form.badge} 
                    onChange={(e) => setForm(f => ({ ...f, badge: e.target.value || "none" }))} 
                    className="mt-2 text-sm"
                  />
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
              <Button onClick={handleSave} className="w-full" disabled={!form.name || !form.category_id || saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editing ? "Update Product" : "Create Product"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
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
            {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
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
                      {imgs.length > 0 && imgs[0].image_path ? (
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
