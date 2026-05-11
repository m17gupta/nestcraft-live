"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Package, RefreshCw, Trash, Zap } from "lucide-react";
import { VariantRow } from "@/lib/admin-products/utils";

interface VariantMatrixProps {
  variants: VariantRow[];
  onVariantsChange: (variants: VariantRow[]) => void;
}

export const VariantMatrix: React.FC<VariantMatrixProps> = ({
  variants,
  onVariantsChange,
}) => {
  const updateVariant = (id: string, field: keyof VariantRow, value: any) => {
    const next = variants.map((v) =>
      (v._id === id || v.sku === id) ? { ...v, [field]: value } : v
    );
    onVariantsChange(next);
  };

  const removeVariant = (id: string) => {
     const next = variants.filter(v => v._id !== id && v.sku !== id);
     onVariantsChange(next);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl italic">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary shadow-inner">
            <Zap size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">Product Variant Matrix</h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">{variants.length} Variants Configured</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 px-8 py-5 italic">Variant Details</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">SKU Identifier</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Sales Price</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Stock Level</TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 px-8 italic">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-64 text-center bg-slate-50/30">
                   <div className="flex flex-col items-center gap-6 text-slate-200">
                      <RefreshCw size={48} strokeWidth={2.5} className="animate-spin-slow" />
                      <span className="text-[11px] font-black uppercase tracking-[0.5em]">Generate variant matrix to see entries</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              variants.map((v, idx) => (
                <TableRow key={v._id || v.sku || idx} className="border-slate-50 hover:bg-slate-50/50 transition-colors group italic">
                  <TableCell className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{v.title}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">ID: {v._id?.slice(-8) || 'NEW-VARIANT'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <input 
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(v._id || v.sku || "", "sku", e.target.value)}
                      className="w-full h-10 bg-white border border-slate-100 rounded-xl px-4 text-[11px] font-bold text-slate-600 focus:border-primary/30 outline-none shadow-inner"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[11px] font-black">$</span>
                       <input 
                         type="text"
                         value={v.price}
                         onChange={(e) => updateVariant(v._id || v.sku || "", "price", e.target.value)}
                         className="w-full h-10 bg-white border border-slate-100 rounded-xl pl-8 pr-4 text-[11px] font-black text-primary focus:border-primary/30 outline-none shadow-inner"
                       />
                    </div>
                  </TableCell>
                  <TableCell>
                    <input 
                      type="text"
                      value={v.stock}
                      onChange={(e) => updateVariant(v._id || v.sku || "", "stock", e.target.value)}
                      className="w-full h-10 bg-white border border-slate-100 rounded-xl px-4 text-[11px] font-black text-slate-900 focus:border-primary/30 outline-none shadow-inner"
                    />
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <button 
                      onClick={() => removeVariant(v._id || v.sku || "")}
                      className="h-10 w-10 flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all rounded-xl shadow-sm active:scale-95"
                    >
                       <Trash size={16} strokeWidth={2.5} />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
