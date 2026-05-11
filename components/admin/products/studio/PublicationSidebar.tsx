"use client";

import React from "react";
import {
  Check,
  ChevronRight,
  Globe,
  LayoutGrid,
  Monitor,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { CategoryRecord } from "@/lib/store/categories/categoriesSlices";

interface PublicationSidebarProps {
  status: string;
  templateKey: string;
  allCategories: CategoryRecord[];
  categoryIds: string[];
  primaryCategoryId: string;
  relatedProductCandidates: any[];
  relatedProductIds: string[];
  onFormChange: (field: string, value: any) => void;
  onToggleCategory: (id: string) => void;
  onToggleRelatedProduct: (id: string) => void;
  allForms: any[];
  formId: string;
}

export const PublicationSidebar: React.FC<PublicationSidebarProps> = ({
  status,
  templateKey,
  allCategories,
  categoryIds,
  primaryCategoryId,
  relatedProductCandidates,
  relatedProductIds,
  onFormChange,
  onToggleCategory,
  onToggleRelatedProduct,
  allForms,
  formId,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-8 shadow-xl italic">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <Monitor size={22} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
            Product Status
          </h3>
        </div>

        <div className="space-y-4">
          {[
            { id: "active", label: "Active", color: "emerald" },
            { id: "draft", label: "Draft", color: "amber" },
            {
              id: "archived",
              label: "Archived",
              color: "slate",
            },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => onFormChange("status", s.id)}
              className={`w-full p-5 border rounded-2xl flex items-center justify-between transition-all group ${
                status === s.id
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                  : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${status === s.id ? `bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]` : `bg-${s.color}-400`}`}
                />
                <span
                  className={`text-[11px] font-black uppercase tracking-widest ${status === s.id ? "text-white" : "text-slate-500"}`}
                >
                  {s.label}
                </span>
              </div>
              {status === s.id && <Check size={18} strokeWidth={3} className="text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Selection */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-8 shadow-xl italic">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <LayoutGrid size={22} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
            Category Selection
          </h3>
        </div>

        <div className="max-h-[350px] overflow-y-auto pr-3 space-y-3 custom-scrollbar">
          {allCategories.map((cat) => (
            <label
              key={cat._id}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all italic ${
                categoryIds.includes(String(cat._id))
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "bg-slate-50 border-slate-100 hover:border-primary/10"
              }`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={categoryIds.includes(String(cat._id))}
                  onChange={() => onToggleCategory(String(cat._id))}
                />
                <div className="h-5 w-5 bg-white border border-slate-200 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center shadow-inner">
                  <Check
                    size={12}
                    strokeWidth={4}
                    className="text-white scale-0 peer-checked:scale-100 transition-transform"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[11px] font-black uppercase tracking-widest ${categoryIds.includes(String(cat._id)) ? "text-slate-900" : "text-slate-400"}`}
                >
                  {cat.name || cat.title}
                </span>
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-0.5">
                  {cat.slug}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Operations Support (Related Products) */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-8 shadow-xl italic">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <ShieldAlert size={22} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
            Product Cross-Sells
          </h3>
        </div>

        <div className="max-h-[250px] overflow-y-auto pr-3 space-y-3 custom-scrollbar">
          {relatedProductCandidates.map((p) => (
            <label
              key={p._id}
              className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all italic ${
                relatedProductIds.includes(p._id!)
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "bg-slate-50 border-slate-100 hover:border-primary/10"
              }`}
            >
              <input
                type="checkbox"
                className="peer hidden"
                checked={relatedProductIds.includes(p._id!)}
                onChange={() => onToggleRelatedProduct(p._id!)}
              />
              <div className="h-5 w-5 bg-white border border-slate-200 rounded-lg peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center shadow-inner">
                <Check size={12} strokeWidth={4} className="text-white" />
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-widest ${relatedProductIds.includes(p._id!) ? "text-slate-900" : "text-slate-400"}`}
              >
                {p.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-8 shadow-xl italic">
        <div className="flex items-center gap-5">
          <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <Zap size={22} strokeWidth={2.5} />
          </div>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
            Linked Structure
          </h3>
        </div>

        <div className="space-y-6">
          <label className="block space-y-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic ml-1">
              Select Form Template
            </span>
            <select
              value={formId}
              onChange={(e) => onFormChange("formId", e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-[11px] font-black uppercase tracking-widest text-primary italic focus:border-primary/50 outline-none transition-all shadow-inner"
            >
              <option value="">NO TEMPLATE LINKED</option>
              {allForms.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl">
            <p className="text-[9px] text-slate-500 uppercase leading-relaxed font-bold tracking-widest">
              Linking a form template allows for custom data capture during the customer checkout process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
