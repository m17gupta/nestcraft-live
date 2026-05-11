"use client";

import React from "react";
import { Info, Terminal, Type } from "lucide-react";
import { slugify } from "@/lib/admin-products/utils";

interface GeneralInformationProps {
  name: string;
  sku: string;
  slug: string;
  description: string;
  onFormChange: (field: string, value: any) => void;
  onSlugChange: (slug: string) => void;
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
  name,
  sku,
  slug,
  description,
  onFormChange,
  onSlugChange,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onFormChange("name", val);
    if (val && !slug) {
      onSlugChange(slugify(val));
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-xl relative overflow-hidden group italic">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
         <Info size={80} strokeWidth={2.5} className="text-primary" />
      </div>
      
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
          <Terminal size={22} strokeWidth={2.5} />
        </div>
        <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">General Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1">
            <Type size={14} strokeWidth={2.5} className="text-primary" /> Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="ENTER PRODUCT NAME..."
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase tracking-widest text-slate-900 focus:border-primary/50 outline-none transition-all placeholder:text-slate-200 shadow-inner italic"
          />
        </div>

        {/* SKU Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 ml-1">
            <Terminal size={14} strokeWidth={2.5} className="text-primary" /> Product SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onFormChange("sku", e.target.value)}
            placeholder="SKU-12345..."
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black uppercase tracking-widest text-slate-900 focus:border-primary/50 outline-none transition-all placeholder:text-slate-200 shadow-inner italic"
          />
        </div>
      </div>

      {/* Slug Field */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
          URL Path (Slug)
        </label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            /product/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="auto-generated-slug"
            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-28 pr-6 text-[13px] font-black text-primary lowercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Product Description</label>
        <textarea
          value={description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="DESCRIBE PRODUCT DETAILS..."
          className="w-full min-h-[160px] bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-[13px] font-black text-slate-900 uppercase tracking-widest leading-relaxed focus:border-primary/50 outline-none transition-all placeholder:text-slate-200 shadow-inner italic resize-none"
        />
      </div>
    </div>
  );
};
