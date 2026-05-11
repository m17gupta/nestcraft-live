"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash,
  Search,
  ChevronRight,
  ChevronDown,
  Package,
  Layout,
  FileText,
  Save,
  X,
  Boxes,
  Tag,
  Upload,
  Database,
  Terminal,
  Zap,
  Globe,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  fetchCategories,
  bulkImportCategories,
} from "@/lib/store/categories/categoriesThunk";
import {
  CategoryRecord,
  CategoryType,
} from "@/lib/store/categories/categoriesSlices";
import { DataImportModal } from "@/components/admin/DataImportModal";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { ImageIcon } from "lucide-react";

const categorySampleData = [
  {
    name: "EQUIPMENT",
    slug: "equipment",
    type: "product",
    description: "Survival equipment and specialized tools.",
    pageStatus: "published",
    metaTitle: "Tactical Survival Equipment",
    metaDescription:
      "Allied Surplus: High-performance survival gear and tools.",
  },
];

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
  pageStatus: string;
  bannerImageUrl: string;
  metaTitle: string;
  metaDescription: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return {
    name: "",
    slug: "",
    type,
    parentId: null,
    description: "",
    pageStatus: "published",
    bannerImageUrl: "",
    metaTitle: "",
    metaDescription: "",
  };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || record.title || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
    pageStatus: record.pageStatus || "published",
    bannerImageUrl: record.bannerImageUrl || "",
    metaTitle: record.metaTitle || "",
    metaDescription: record.metaDescription || "",
  };
}

function CategoriesPageContent() {
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDraft>(createDraft());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);

  const { allCategories: categories, categoryLoading: loading } =
    useAppSelector((state: RootState) => state.adminCategories);

  const dispatch = useAppDispatch();

  console.log(form);

  const resetForm = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportCategories(data));
    if (bulkImportCategories.fulfilled.match(resultAction)) {
      dispatch(fetchCategories());
      return { message: `${data.length} CATEGORIES SYNCED` };
    } else {
      throw new Error(
        (resultAction.payload as any)?.message || "Import failed",
      );
    }
  };

  const totals = useMemo(
    () => ({
      all: categories.length,
      product: categories.filter((item) => item.type === "product").length,
      portfolio: categories.filter((item) => item.type === "portfolio").length,
      blog: categories.filter((item) => item.type === "blog").length,
    }),
    [categories],
  );

  const openCreate = (parentId: string | null = null) => {
    setForm({ ...createDraft(typeFilter || "product"), parentId });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (record: CategoryRecord) => {
    setForm(toDraft(record));
    setEditingId(record._id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.name) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);
    const tId = toast.loading("Saving categories...");
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, payload })).unwrap();
        toast.success("Category updated", { id: tId });
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("Categories saved", { id: tId });
      }
      resetForm();
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error(
        "Failed to save category: " + (err?.message || "Unknown error"),
        { id: tId },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: CategoryRecord) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${record.name || record.title}"?`,
      )
    )
      return;
    const tId = toast.loading("Deleting category...");
    try {
      await dispatch(deleteCategory(record._id!)).unwrap();
      toast.success("Category deleted", { id: tId });
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error("Failed to delete category", { id: tId });
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNodes(newSet);
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories;
    if (typeFilter) {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => {
        const name = c.name || c.title || "";
        return (
          name.toLowerCase().includes(lowerQuery) ||
          c.slug.toLowerCase().includes(lowerQuery)
        );
      });
    }
    return filtered;
  }, [categories, searchQuery, typeFilter]);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryRecord & { children: any[] }>();
    const roots: any[] = [];

    filteredCategories.forEach((c) => map.set(c._id!, { ...c, children: [] }));

    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  }, [filteredCategories]);

  const renderRows = (nodes: any[], depth: number = 0): React.ReactNode[] => {
    return nodes.flatMap((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedNodes.has(node._id) || searchQuery.length > 0;
      const name = node.name || node.title || "Unnamed Category";

      const row = (
        <TableRow
          key={node._id}
          className={`group border-slate-100 hover:bg-slate-50 transition-all duration-500 ${depth > 0 ? "bg-slate-50/30" : ""}`}
        >
          <TableCell
            className="w-full sm:w-[50%] px-10 py-6"
            style={{ paddingLeft: `${depth * 4 + 2.5}rem` }}
          >
            <div className="flex items-center gap-6">
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(node._id, e)}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all border ${isExpanded ? "bg-primary/10 border-primary/20 text-primary" : "bg-white border-slate-200 text-slate-300 hover:text-primary"}`}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} strokeWidth={2.5} />
                  ) : (
                    <ChevronRight size={16} strokeWidth={2.5} />
                  )}
                </button>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-none bg-slate-200" />
                </div>
              )}

              <div
                className={`flex items-center justify-center w-12 h-12 rounded-none border ${depth === 0 ? "bg-primary/5 border-primary/10 text-primary shadow-inner" : "bg-slate-50 border-slate-100 text-slate-300"}`}
              >
                <FolderTree size={20} />
              </div>

              <div className="flex flex-col space-y-1">
                <span
                  className={`font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors ${depth === 0 ? "text-sm" : "text-xs"}`}
                >
                  {name}
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary/60 transition-colors">
                  /{node.slug}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-none">
              {node.type}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-primary/40" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {node.children.length} Sub-Nodes
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right px-10">
            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <button
                className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                onClick={() => openCreate(node._id)}
                title="Add Sub-Category"
              >
                <Plus size={18} />
              </button>
              <button
                className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                onClick={() => openEdit(node)}
                title="Edit Category"
              >
                <Edit size={18} />
              </button>
              <button
                className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                onClick={() => handleDelete(node)}
                title="Delete Category"
              >
                <Trash size={18} />
              </button>
            </div>
          </TableCell>
        </TableRow>
      );

      if (isExpanded && hasChildren) {
        return [row, ...renderRows(node.children, depth + 1)];
      }

      return [row];
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-4">
          <h1 className="text-5xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Category <span className="text-primary">Taxonomy</span>
          </h1>
          <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Database size={14} className="text-primary" /> System hierarchy for asset categorization and navigation.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="h-14 px-8 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center gap-3 rounded-none shadow-sm"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={18} /> Bulk Import
          </button>
          <button
            className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-primary/20 rounded-none"
            onClick={() => openCreate(null)}
          >
            <Plus size={20} strokeWidth={3} /> Add Category
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          {
            label: "Total Hubs",
            val: totals.all,
            icon: Boxes,
            color: "primary",
          },
          {
            label: "Product Categories",
            val: totals.product,
            icon: Package,
            color: "primary",
          },
          {
            label: "Portfolio Groups",
            val: totals.portfolio,
            icon: Layout,
            color: "primary",
          },
          {
            label: "Article Categories",
            val: totals.blog,
            icon: FileText,
            color: "primary",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 p-8 rounded-none shadow-sm group hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-primary/60 transition-colors">
                {stat.label}
              </span>
              <stat.icon
                size={16}
                className={`text-primary opacity-40 group-hover:opacity-100 transition-opacity`}
              />
            </div>
            <div className="text-4xl font-heading font-black text-slate-900 tracking-tight">
              {stat.val}
            </div>
          </div>
        ))}
      </div>

      {/* Inline Editor Form */}
      {showForm && (
        <div className="bg-white border-l-[6px] border-primary p-12 space-y-12 shadow-xl rounded-none animate-in slide-in-from-top-6 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-none -translate-y-32 translate-x-32" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-none flex items-center justify-center text-primary shadow-inner">
                <Tag size={24} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                  {editingId
                    ? "Modify Category Hub"
                    : "Add New Category"}
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
                  Configure hierarchical structure and platform visibility.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center rounded-none shadow-inner"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Category Name
                </label>
                <input
                  placeholder="e.g. LIVING ROOM FURNITURE"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
                />
              </div>
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  URL Slug
                </label>
                <input
                  placeholder="living-room-furniture"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-primary lowercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Category Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as CategoryType,
                    }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
                >
                  <option value="product">Product Catalog</option>
                  <option value="portfolio">Portfolio Gallery</option>
                  <option value="blog">Articles & Blog</option>
                </select>
              </div>
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Parent Category
                </label>
                <select
                  value={form.parentId || "none"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      parentId:
                        e.target.value === "none" ? null : e.target.value,
                    }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
                >
                  <option value="none">-- ROOT CATEGORY --</option>
                  {categories
                    .filter((c) => c.type === form.type && c._id !== editingId)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name || c.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Visibility Status
                </label>
                <select
                  value={form.pageStatus}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pageStatus: e.target.value }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Banner Image
                </label>
                <div className="flex gap-4">
                  <input
                    placeholder="IMAGE URL"
                    value={form.bannerImageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: e.target.value,
                      }))
                    }
                    className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-bold text-slate-900 tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
                  />
                  <MediaLibraryModal
                    onSelect={(media) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: media.url,
                      }))
                    }
                    trigger={
                      <button
                        type="button"
                        className="h-14 w-14 bg-slate-50 border border-slate-200 text-primary hover:bg-primary/5 flex items-center justify-center transition-all rounded-none shadow-sm"
                      >
                        <ImageIcon size={22} strokeWidth={2.5} />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Internal notes about this category..."
                  className="w-full h-32 bg-slate-50 border border-slate-200 rounded-none p-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none resize-none transition-all shadow-inner placeholder:text-slate-200"
                />
              </div>
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  SEO Title
                </label>
                <input
                  placeholder="Meta title for search engines"
                  value={form.metaTitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, metaTitle: e.target.value }))
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                SEO Description
              </label>
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                placeholder="Meta description for search engines..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-none p-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none resize-none transition-all shadow-inner placeholder:text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-6 pt-10 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="h-14 px-10 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 rounded-none transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-14 px-14 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-4 rounded-none transition-all active:scale-95 hover:bg-primary/90"
              >
                {saving ? (
                  <div className="h-5 w-5 border-[3px] border-white/20 border-t-white rounded-none animate-spin" />
                ) : (
                  <Save size={20} strokeWidth={2.5} />
                )}
                {editingId ? "Update Category" : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-8 items-center justify-between bg-white p-6 rounded-none border border-slate-100 shadow-sm">
        <div className="flex gap-3 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-3 sm:pb-0">
          {(["", "product", "portfolio", "blog"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => setTypeFilter(type)}
              className={`px-8 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all ${
                typeFilter === type
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20"
              }`}
            >
              {type || "Unified Grid"}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-[450px] group">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors"
            size={18}
            strokeWidth={2.5}
          />
          <input
            placeholder="SEARCH CATEGORY HIERARCHY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-none text-[13px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Hierarchy Table */}
      <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-sm relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <FolderTree size={200} className="text-primary" />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-none h-20">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-10">
                Category Hierarchy
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Type
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Connectivity
              </TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-10">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-lg shadow-primary/10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">
                      Syncing Taxonomy...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : tree.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-6 opacity-10">
                    <FolderTree size={48} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                      Inventory Nodes Not Localized
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              renderRows(tree)
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-5 p-8 bg-white border border-slate-100 rounded-none shadow-sm">
        <Terminal size={18} className="text-primary" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Platform Hierarchy Status: Optimized | Core Sync: Active | Access: Admin Level-4
        </span>
      </div>

      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        sampleData={categorySampleData}
        title="Bulk Category Import"
        description="Import categories via JSON."
        fileName="categories"
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
            <div className="h-16 w-16 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-2xl shadow-primary/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40">
              Initializing Category Hub...
            </span>
          </div>
        }
      >
        <CategoriesPageContent />
      </Suspense>
    </div>
  );
}
