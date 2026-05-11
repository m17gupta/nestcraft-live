"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  bulkImportProducts,
} from "@/lib/store/products/productsThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  Eye,
  ChevronDown,
  ChevronUp,
  Upload,
  Image as ImageIcon,
  Package,
  Search,
  X,
  LayoutGrid,
  Rows,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Target,
  Zap,
  ShieldAlert,
  Database,
  Activity,
} from "lucide-react";
import { Link } from "@/lib/router";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store/store";
import { DataImportModal } from "@/components/admin/DataImportModal";

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { allProducts, loading } = useAppSelector(
    (state: RootState) => state.adminProducts,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleImport = async (data: any[]) => {
    setImporting(true);
    try {
      const resultAction = await dispatch(bulkImportProducts(data));
      if (bulkImportProducts.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || "Bulk import failed.",
        );
      }
    } finally {
      setImporting(false);
    }
  };

  const productSampleData = [
    {
      name: "Modern Velvet Sofa",
      sku: "SOFA-VEL-001",
      type: "physical",
      price: 1249.99,
      status: "active",
      description: "Premium velvet upholstery with solid oak legs.",
      categories: ["living-room", "sofas"],
      images: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
      ],
      options: [
        {
          label: "Color",
          values: ["Emerald", "Navy", "Grey"],
          useForVariants: true,
        },
        { label: "Material", values: ["Velvet"], useForVariants: true },
      ],
      variants: [
        {
          sku: "SOFA-VEL-001-EMR",
          title: "Emerald / Velvet",
          price: 1249.99,
          stock: 12,
          optionValues: { Color: "Emerald", Material: "Velvet" },
        },
      ],
    },
  ];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete product: "${name}"?`)) return;
    const toastId = toast.loading(`Deleting ${name}...`);
    try {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success(`Product ${name} deleted successfully.`, { id: toastId });
        dispatch(fetchProducts());
      } else {
        toast.error("Failed to delete product.", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-10">
        <div className="space-y-3">
          <h1 className="text-5xl font-heading font-black text-slate-900 uppercase tracking-tighter leading-none">
            Product <span className="text-primary">Catalog</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold flex items-center gap-3 uppercase tracking-[0.3em] text-[11px]">
            <Activity size={14} className="text-primary/60" strokeWidth={2.5} /> 
            Manage Global Inventory & Specifications
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Button
            variant="outline"
            className="h-14 px-8 border-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest rounded-none hover:text-primary hover:border-primary/30 transition-all flex items-center gap-4 group shadow-sm bg-white"
            onClick={() => setShowImportModal(true)}
            disabled={importing}
          >
            <Upload
              size={18}
              strokeWidth={2.5}
              className="group-hover:-translate-y-1 transition-transform"
            />
            Batch Import
          </Button>
          <DataImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            sampleData={productSampleData}
            title="Bulk Catalog Sync"
            description="Process JSON manifests to synchronize global product listings."
            fileName="nestcraft_catalog_export"
          />
          <Link href="/admin/products/new">
            <Button className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[11px] uppercase tracking-widest rounded-none transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-primary/20">
              <Plus size={20} strokeWidth={3} /> New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-6 rounded-none border border-slate-100 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-all" strokeWidth={2.5} />
          <input
            placeholder="Search by name or serial identification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 h-14 bg-slate-50 border border-slate-200 rounded-none text-[13px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <Button
            variant="outline"
            className="h-14 px-8 flex-1 lg:flex-none border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 font-black text-[10px] uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-3 bg-white"
          >
            <Filter size={18} strokeWidth={2.5} /> Filters
          </Button>
          <Button
            variant="outline"
            className="h-14 px-8 border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 font-black text-[10px] uppercase tracking-[0.2em] rounded-none transition-all flex items-center justify-center gap-3 bg-white"
          >
            <Download size={18} strokeWidth={2.5} /> Export
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100 h-20">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-10">
                Product Details
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Serial Identification
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Lifecycle Status
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Configuration
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-right px-10">
                Protocol
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 border-2 border-slate-100 border-t-primary rounded-none animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
                      Syncing Products...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-96 text-center p-12">
                  <div className="flex flex-col items-center gap-6 text-slate-900">
                    <div className="h-24 w-24 rounded-none border border-slate-50 flex items-center justify-center bg-slate-50/30">
                      <Package
                        size={48}
                        strokeWidth={1}
                        className="opacity-40"
                      />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.3em] leading-relaxed">
                      No products found in catalog.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((prod) => (
                <TableRow
                  key={prod._id}
                  className="group border-slate-50 hover:bg-slate-50/50 transition-all duration-500"
                >
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-8">
                      <div className="h-20 w-20 rounded-none overflow-hidden bg-slate-50 border border-slate-100 group-hover:border-primary/30 transition-all shadow-sm relative">
                        {prod.gallery && prod.gallery[0] ? (
                          <img
                            src={String(prod.gallery[0].url)}
                            alt={String(prod.gallery[0].alt)}
                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-200">
                            <ImageIcon size={28} strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-col space-y-2 overflow-hidden">
                        <span className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors truncate">
                          {prod.name}
                        </span>
                        <div className="flex items-center gap-3">
                           <span className="text-xl font-heading font-black text-primary tracking-tighter leading-none">
                            ₹{Number(prod.price).toLocaleString()}
                          </span>
                          <span className="h-4 w-[1px] bg-slate-100" />
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">BASE VALUATION</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-mono font-bold text-primary px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-xl uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      {prod.sku || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-3 px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all",
                        prod.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100/50"
                          : "bg-slate-50 text-slate-400 border-slate-200",
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-none",
                          prod.status === "active"
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-slate-300",
                        )}
                      />
                      {prod.status === "active" ? "OPERATIONAL" : "ARCHIVED"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-slate-400 group-hover:text-primary/70 transition-all">
                      <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 shadow-inner">
                        <Zap size={18} strokeWidth={2.5} className="text-primary/50" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{prod.variants.length || 0}</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">CONFIGURATIONS</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-none border border-slate-100 bg-white text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm active:scale-95"
                        onClick={() =>
                          router.push(`/admin/products/${prod._id}/edit`)
                        }
                      >
                        <Edit size={20} strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-none border border-slate-100 bg-white text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-95"
                        onClick={() => handleDelete(String(prod._id), prod.name)}
                      >
                        <Trash size={20} strokeWidth={2.5} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
          <div className="h-8 w-8 border-2 border-slate-100 border-t-primary rounded-none animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Initializing Catalog...
          </span>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
