"use client";

import React from "react";
import { DollarSign, Percent, ShieldAlert, Zap } from "lucide-react";

interface PricingInventoryProps {
  pricing: {
    price: string | number;
    compareAtPrice?: string | number;
    costPerItem?: string | number;
    chargeTax?: boolean;
    trackQuantity?: boolean;
    quantity?: number;
  };
  onPricingChange: (field: string, value: any) => void;
}

export const PricingInventory: React.FC<PricingInventoryProps> = ({
  pricing,
  onPricingChange,
}) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-xl italic">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
          <Zap size={22} strokeWidth={2.5} />
        </div>
        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">Pricing & Inventory</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Price Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1">
            <DollarSign size={14} strokeWidth={2.5} className="text-primary" /> Selling Price
          </label>
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[13px]">$</span>
             <input
                type="text"
                value={pricing.price}
                onChange={(e) => onPricingChange("price", e.target.value)}
                placeholder="199.99"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 text-[13px] font-black text-slate-900 focus:border-primary/50 outline-none transition-all shadow-inner"
             />
          </div>
        </div>

        {/* Compare At Price Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1">
            <Percent size={14} strokeWidth={2.5} className="text-slate-300" /> Compare at Price
          </label>
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-200 font-black text-[13px]">$</span>
             <input
                type="text"
                value={pricing.compareAtPrice || ""}
                onChange={(e) => onPricingChange("compareAtPrice", e.target.value)}
                placeholder="249.99"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 text-[13px] font-black text-slate-400 line-through decoration-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner"
             />
          </div>
        </div>

        {/* Cost Per Item Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1">
            <ShieldAlert size={14} strokeWidth={2.5} className="text-slate-300" /> Cost per Item
          </label>
          <div className="relative">
             <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[13px]">$</span>
             <input
                type="text"
                value={pricing.costPerItem || ""}
                onChange={(e) => onPricingChange("costPerItem", e.target.value)}
                placeholder="85.00"
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-5 text-[13px] font-black text-slate-500 focus:border-primary/50 outline-none transition-all shadow-inner"
             />
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-slate-50 flex flex-wrap items-center gap-12">
          <label className="flex items-center gap-5 cursor-pointer group">
             <div className="relative">
                <input 
                  type="checkbox" 
                  className="peer hidden" 
                  checked={pricing.chargeTax}
                  onChange={(e) => onPricingChange("chargeTax", e.target.checked)}
                />
                <div className="h-7 w-12 bg-slate-100 border border-slate-200 rounded-full peer-checked:bg-primary/10 peer-checked:border-primary/40 transition-all duration-300 shadow-inner" />
                <div className="absolute top-1 left-1 h-5 w-5 bg-white rounded-full peer-checked:bg-primary peer-checked:translate-x-5 transition-all duration-300 shadow-sm" />
             </div>
             <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-[0.3em]">Charge tax on this product</span>
          </label>

          <label className="flex items-center gap-5 cursor-pointer group">
             <div className="relative">
                <input 
                  type="checkbox" 
                  className="peer hidden" 
                  checked={pricing.trackQuantity}
                  onChange={(e) => onPricingChange("trackQuantity", e.target.checked)}
                />
                <div className="h-7 w-12 bg-slate-100 border border-slate-200 rounded-full peer-checked:bg-primary/10 peer-checked:border-primary/40 transition-all duration-300 shadow-inner" />
                <div className="absolute top-1 left-1 h-5 w-5 bg-white rounded-full peer-checked:bg-primary peer-checked:translate-x-5 transition-all duration-300 shadow-sm" />
             </div>
             <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-[0.3em]">Track quantity</span>
          </label>
      </div>
    </div>
  );
};
