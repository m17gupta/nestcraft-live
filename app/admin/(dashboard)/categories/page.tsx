"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  FolderTree, 
  
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Package, 
  Layout, 
  FileText, 
  Save, 
  Loader2, 
  X,
  Boxes,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

type CategoryType = "product" | "portfolio" | "blog";

type CategoryRecord = {
  _id: string;
  name?: string;
  title?: string;
  slug: string;
  type: CategoryType;
  parentId?: string | null;
  description?: string;
  entityCount?: number;
};

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return {
    name: "",
    slug: "",
    type,
    parentId: null,
    description: "",
  };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || record.title || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDraft>(createDraft());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/ecommerce/categories?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.categories || []);
      }
    } catch (e) {
      toast.error("Failed to load categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  // Initially expand root nodes after load (so it's not collapsed and empty looking)
  useEffect(() => {
    if (categories.length > 0 && expandedNodes.size === 0) {
      const roots = categories.filter(c => !c.parentId);
      const newSet = new Set<string>();
      roots.forEach(r => newSet.add(r._id));
      setExpandedNodes(newSet);
    }
  }, [categories]);

  const resetForm = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  };

  const totals = useMemo(() => ({
    all: categories.length,
    product: categories.filter((item) => item.type === "product").length,
    portfolio: categories.filter((item) => item.type === "portfolio").length,
    blog: categories.filter((item) => item.type === "blog").length,
  }), [categories]);

  const openCreate = (parentId: string | null = null) => {
    setForm({ ...createDraft(typeFilter || "product"), parentId });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (record: CategoryRecord) => {
    setForm(toDraft(record));
    setEditingId(record._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(editingId ? "Updating category..." : "Creating category...");
    
    const endpoint = editingId ? `/api/ecommerce/categories/${editingId}` : "/api/ecommerce/categories";
    const method = editingId ? "PUT" : "POST";
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      type: form.type,
      parentId: form.parentId || null,
      description: form.description.trim(),
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(editingId ? "Category updated." : "Category created.", { id: toastId });
        resetForm();
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data?.error || "Failed to save category.", { id: toastId });
      }
    } catch (e) {
      toast.error("Network error saving category.", { id: toastId });
    }
    setSaving(false);
  };

  const handleDelete = async (record: CategoryRecord) => {
    const name = record.name || record.title;
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    const toastId = toast.loading(`Deleting ${name}...`);
    try {
      const res = await fetch(`/api/ecommerce/categories/${record._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted.", { id: toastId });
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data?.error || "Failed to delete category.", { id: toastId });
      }
    } catch (e) {
      toast.error("Network error deleting category.", { id: toastId });
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNodes(newSet);
  };

  // Build Hierarchy
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const lowerQuery = searchQuery.toLowerCase();
    return categories.filter(c => {
      const n = c.name || c.title || "";
      return n.toLowerCase().includes(lowerQuery) || c.slug.toLowerCase().includes(lowerQuery);
    });
  }, [categories, searchQuery]);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryRecord & { children: any[] }>();
    const roots: any[] = [];
    
    filteredCategories.forEach(c => map.set(c._id, { ...c, children: [] }));
    
    map.forEach(c => {
      if (c.parentId && map.has(c.parentId)) {
         map.get(c.parentId)!.children.push(c);
      } else {
         roots.push(c);
      }
    });
    
    return roots;
  }, [filteredCategories]);

  // Recursively render tree nodes perfectly styled as cards
  const renderNode = (node: CategoryRecord & { children: any[] }, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node._id) || searchQuery.length > 0;
    const name = node.name || node.title || "Unnamed Category";

    // Sub-items rendering
    if (depth > 0) {
      return (
        <div key={node._id} className="relative mt-2">
          {/* Tree relationship line */}
          <div className="absolute top-0 bottom-0 left-[22px] w-[1px] bg-border/60 -z-10" />
          
          <div className={`ml-8 bg-surface border border-border/50 rounded-lg p-3 group transition-all hover:border-primary/30 hover:shadow-sm ${isExpanded ? 'mb-2' : ''}`}>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   {hasChildren ? (
                    <button 
                      onClick={(e) => toggleExpand(node._id, e)}
                      className="flex bg-muted/30 hover:bg-primary/10 hover:text-primary items-center justify-center w-6 h-6 rounded-md transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center text-muted-foreground/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13px] text-foreground">{name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">/{node.slug}</span>
                  </div>
                </div>

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-muted" onClick={() => openCreate(node._id)} title="Add Subcategory">
                    <Plus size={13} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-muted" onClick={() => openEdit(node)} title="Edit Category">
                    <Pencil size={13} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(node)} title="Delete Category">
                    <Trash2 size={13} />
                  </Button>
                </div>
             </div>
             
             <AnimatePresence>
               {isExpanded && hasChildren && (
                 <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-1"
                 >
                   <div className="pt-1">
                     {node.children.map(child => renderNode(child, depth + 1))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      );
    }

    // Root nodes rendering (large cards)
    return (
      <Card key={node._id} className="mb-4 overflow-visible border-border/60 shadow-xs hover:shadow-sm transition-shadow group">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer"
          onClick={() => hasChildren && toggleExpand(node._id)}
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${hasChildren && isExpanded ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
               <FolderTree size={18} />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-foreground">{name}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                  Root Level
                </span>
                {hasChildren && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {node.children.length} Items
                  </span>
                )}
              </div>
              <span className="text-[12px] font-mono text-muted-foreground mt-0.5">/{node.slug}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold gap-1.5 border-border bg-surface hover:bg-muted" onClick={() => openCreate(node._id)}>
                  <Plus size={13} /> Subcategory
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-primary" onClick={() => openEdit(node)}>
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(node)}>
                  <Trash2 size={14} />
                </Button>
             </div>
             {hasChildren && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface border border-border text-muted-foreground transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  <ChevronDown size={16} />
                </div>
             )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }} 
               animate={{ height: "auto", opacity: 1 }} 
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="overflow-hidden"
            >
               <div className="px-4 pb-4 pt-1 bg-surface/30 border-t border-border/30">
                 {node.children.map(child => renderNode(child, depth + 1))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 sm:p-8 max-w-[1400px] mx-auto">
      {/* Header & Stats Banner */}
      <div className="grid lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Category Management</h1>
            <p className="text-muted-foreground max-w-2xl">
              Organize your store's taxonomy with our premium hierarchy matrix. Top-level categories act as main navigational nodes, while nested items create structured sub-menus.
            </p>
        </div>
        
        <div className="flex justify-end lg:col-span-1">
            <Button onClick={() => openCreate(null)} className="h-11 px-6 font-bold shadow-md gap-2 rounded-xl transition-all hover:scale-[1.02]">
              <Plus size={16} /> Add Category
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Total Hubs</p>
              <p className="text-3xl font-black text-foreground">{totals.all}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Boxes size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mb-1">Products</p>
              <p className="text-3xl font-black text-primary">{totals.product}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-purple-500/5 border-purple-500/20 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-1">Portfolio</p>
              <p className="text-3xl font-black text-purple-500">{totals.portfolio}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Layout size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card to-amber-500/5 border-amber-500/20 shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500 mb-1">Blog</p>
              <p className="text-3xl font-black text-amber-600">{totals.blog}</p>
            </div>
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <FileText size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor Form Modal/Inline */}
      {showForm && (
        <Card className="border-border/60 shadow-xl relative overflow-hidden rounded-2xl p-1 bg-gradient-to-b from-card to-surface pb-0 animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-primary/50" />
          <CardHeader className="pt-6 pb-4 px-6 border-b border-border/40">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                   <Tag size={20} />
                 </div>
                 <div>
                  <CardTitle className="text-xl font-bold">
                    {editingId ? "Edit Category Details" : "Create New Category"}
                  </CardTitle>
                  <CardDescription className="text-sm mt-0.5">
                    Define the name, path, and precise hierarchical placement.
                  </CardDescription>
                 </div>
              </div>
              <Button variant="ghost" size="icon" onClick={resetForm} className="h-10 w-10 bg-muted/50 hover:bg-muted rounded-full">
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-8 bg-card/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Category Name</Label>
                  <Input 
                    placeholder="e.g. Modern Sofas" 
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 border-border/80 bg-surface focus-visible:ring-primary/30 text-base"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">URL Slug / Path</Label>
                  <Input 
                    placeholder="modern-sofas" 
                    value={form.slug}
                    onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                    className="h-12 font-mono text-sm border-border/80 bg-surface focus-visible:ring-primary/30"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Taxonomy Base Type</Label>
                  <Select value={form.type} onValueChange={(v: CategoryType) => setForm(prev => ({ ...prev, type: v }))}>
                    <SelectTrigger className="h-12 border-border/80 bg-surface focus-visible:ring-primary/30 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product Catalog</SelectItem>
                      <SelectItem value="portfolio">Portfolio Galley</SelectItem>
                      <SelectItem value="blog">Blog Articles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Parent Node Link</Label>
                  <Select value={form.parentId || "none"} onValueChange={(v) => setForm(prev => ({ ...prev, parentId: v === "none" ? null : v }))}>
                    <SelectTrigger className="h-12 border-border/80 bg-surface focus-visible:ring-primary/30 font-medium">
                      <SelectValue placeholder="No Parent (Top Level)" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="none" className="font-bold text-primary">-- No Parent Node (Standalone Key) --</SelectItem>
                      {categories
                        .filter(c => c.type === form.type && c._id !== editingId)
                        .map(c => {
                          const n = c.name || c.title || "Unnamed";
                          return (
                            <SelectItem key={c._id} value={c._id}>
                              {n} <span className="text-muted-foreground block text-[10px] font-mono">/{c.slug}</span>
                            </SelectItem>
                          );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Internal Description <span className="font-normal opacity-60">(Optional)</span></Label>
                <Textarea 
                  placeholder="Describe what items live within this category node..." 
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] resize-none border-border/80 bg-surface focus-visible:ring-primary/30 text-base"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={resetForm} className="h-12 px-8 font-semibold rounded-xl border-border/80 hover:bg-muted">Cancel Setup</Button>
                <Button type="submit" disabled={saving} className="h-12 px-8 font-bold gap-2 rounded-xl text-md">
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} 
                  {editingId ? "Save Changes" : "Build Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Workspace & Tools */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border/70 rounded-2xl p-2 px-3 shadow-xs">
        <div className="flex gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(["", "product", "portfolio", "blog"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => setTypeFilter(type)}
              className={`px-5 py-2.5 rounded-xl text-[13px] whitespace-nowrap font-bold capitalize transition-all duration-200 ${
                typeFilter === type 
                  ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]" 
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type || "All Branches"}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-[360px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search hierarchy..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 bg-surface border-border/60 focus-visible:ring-primary/30 rounded-xl text-sm transition-shadow font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Data Tree Rendering */}
      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground bg-card rounded-3xl border border-border/50">
            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            <span className="font-semibold tracking-wide">Syncing Taxonomy Matrix...</span>
          </div>
        ) : tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 px-4 text-center bg-card rounded-3xl border border-border/50 shadow-sm">
             <div className="h-20 w-20 mb-6 rounded-2xl bg-muted/50 flex flex-col items-center justify-center text-muted-foreground shadow-inner border border-border">
               <FolderTree size={32} />
             </div>
             <h3 className="font-extrabold text-2xl mb-2 text-foreground">No Categories Found</h3>
             <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
               Your hierarchy is currently empty. Click the button below to initialize your first root category.
             </p>
             <Button onClick={() => openCreate(null)} className="h-12 px-8 font-bold shadow-md rounded-xl text-md">
                 Initialize Matrix
             </Button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            {tree.map(node => renderNode(node, 0))}
          </div>
        )}
      </div>
    </div>
  );
}
