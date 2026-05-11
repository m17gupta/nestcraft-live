"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchVariants, selectAdminVariants, selectAdminVariantsLoading } from "@/lib/store/features/adminVariantsSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash, 
  ListTree, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Plus,
  Box,
  Layers,
  ArrowUpRight,
  Database,
  Tag,
  AlertCircle,
  CheckCircle2,
  Package,
  Target,
  Zap,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function VariantsPage() {
  const dispatch = useAppDispatch();
  const variants = useAppSelector(selectAdminVariants);
  const loading = useAppSelector(selectAdminVariantsLoading);
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchVariants());
  }, [dispatch]);

  const filteredVariants = variants.filter(v => 
    v.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-primary/60">
            <Layers size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Asset Variation Control
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Product <span className="text-primary">Variants</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Managing and coordinating product variations.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <button className="h-14 px-8 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-none hover:text-primary hover:border-primary/30 transition-all flex items-center gap-4 group shadow-sm">
            <Download size={18} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform" /> Export Data Stream
          </button>
          <button className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest rounded-none transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-primary/20">
            <Plus size={20} strokeWidth={3} /> New Configuration
          </button>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Inventory", count: variants.length, icon: Layers, color: "text-emerald-500", bg: "bg-emerald-50/50", border: "border-emerald-100/50" },
          { label: "Supply Alerts", count: variants.filter(v => (v.stock || 0) <= 0).length, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50/50", border: "border-red-100/50" },
          { label: "Aggregate Value", count: `₹${variants.reduce((acc, v) => acc + (v.price || 0) * (v.stock || 0), 0).toLocaleString()}`, icon: Database, color: "text-primary", bg: "bg-primary/5", border: "border-primary/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-8 rounded-none shadow-sm flex items-center gap-8 group hover:border-primary/20 transition-all relative overflow-hidden">
             <div className={cn("h-16 w-16 rounded-none flex items-center justify-center border transition-all shadow-inner relative z-10", stat.bg, stat.color, stat.border)}>
                <stat.icon size={28} strokeWidth={2.5} />
             </div>
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 leading-none mb-3 group-hover:text-primary/50 transition-colors">{stat.label}</p>
                <p className="text-4xl font-heading font-black text-slate-900 tracking-tighter leading-none">{stat.count}</p>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <stat.icon size={80} />
             </div>
          </div>
        ))}
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row items-center gap-8 bg-white p-6 rounded-none border border-slate-100 shadow-sm">
         <div className="relative flex-1 group w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all" size={20} strokeWidth={2.5} />
            <input 
               placeholder="Search by SKU, handle or variant identification..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-14 pl-16 pr-6 bg-slate-50 border border-slate-200 rounded-none text-[13px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner"
            />
         </div>
         <div className="flex items-center gap-4 w-full lg:w-auto">
            <button className="h-14 px-8 flex-1 lg:flex-none border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 font-black text-[10px] uppercase tracking-widest rounded-none transition-all flex items-center justify-center gap-3 bg-white shadow-sm">
               <Filter size={18} strokeWidth={2.5} /> Filter Parameters
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden lg:block" />
            <button className="h-14 px-8 border border-slate-50 text-slate-300 font-black text-[9px] uppercase tracking-[0.4em] hover:text-primary transition-colors">
               Archived Hub
            </button>
         </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-sm relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
          <Package size={180} className="text-primary" />
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100 h-20">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-10">Variant Identity</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Serial (SKU)</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Valuation</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Availability</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Specifications</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-right px-10">Protocol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-80 text-center">
                   <div className="flex flex-col items-center gap-8">
                      <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-xl shadow-primary/10" />
                      <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 animate-pulse">Loading Variations...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredVariants.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={6} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-8 text-slate-100">
                      <div className="h-24 w-24 rounded-[2rem] border border-slate-50 flex items-center justify-center bg-slate-50/50 shadow-inner">
                         <ListTree size={48} strokeWidth={1.5} className="text-slate-200" />
                      </div>
                      <div className="text-center space-y-2">
                        <span className="text-[15px] font-black text-slate-300 uppercase tracking-[0.4em] leading-relaxed">No variants identified in database.</span>
                        <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest mt-2">Adjust search parameters to broaden results.</p>
                      </div>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredVariants.map((variant) => (
                <TableRow key={variant._id} className="group border-slate-50 hover:bg-slate-50/50 transition-all duration-500">
                  <TableCell className="px-10 py-10">
                     <div className="flex flex-col space-y-2 overflow-hidden">
                        <span className="text-[15px] font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-primary transition-colors truncate">{variant.title}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <span className="text-2xl font-heading font-black text-slate-900 tracking-tighter tabular-nums group-hover:text-primary transition-colors">₹{Number(variant.price).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                     <div className={cn(
                       "inline-flex items-center gap-3 px-5 py-2 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all duration-500 shadow-sm",
                       (variant.stock || 0) <= 0 
                         ? "bg-red-50 text-red-500 border-red-100" 
                         : "bg-emerald-50 text-emerald-600 border-emerald-100"
                     )}>
                       <div className={cn("h-2 w-2 rounded-none", (variant.stock || 0) <= 0 ? "bg-red-500" : "bg-emerald-500 animate-pulse")} />
                       {variant.stock || 0} Assets In-Stock
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-3">
                       {variant.optionValues && Object.entries(variant.optionValues).map(([key, val]) => (
                         <div key={key} className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl group-hover:border-primary/20 group-hover:bg-primary/5 transition-all shadow-inner">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}:</span>
                           <span className="text-[10px] font-bold text-slate-900 uppercase">{val as string}</span>
                         </div>
                       ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3">
                       <button className="h-12 w-12 rounded-none border border-slate-100 bg-white text-slate-300 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center group/btn shadow-sm active:scale-95" title="Modify Config">
                          <Edit size={20} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                       <button className="h-12 w-12 rounded-none border border-slate-100 bg-white text-slate-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all flex items-center justify-center group/btn shadow-sm active:scale-95" title="Remove Record">
                          <Trash size={20} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
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
