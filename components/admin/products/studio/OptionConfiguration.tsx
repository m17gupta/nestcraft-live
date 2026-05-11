"use client";

import React from "react";
import { Layers, Sparkles, Plus, Trash, Zap, Target } from "lucide-react";
import { ProductOption } from "@/lib/admin-products/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useSearchParams } from "next/navigation";
import { SectionCard } from "./Common";
import { cn } from "@/lib/utils";

interface OptionConfigurationProps {
  attributeSetIds: string[];
  options: ProductOption[];
  onToggleAttributeSet: (id: string) => void;
  onOptionChange: (idx: number, opt: ProductOption) => void;
  onAddOptionValue: (idx: number) => void;
  onRegenerateVariants: () => void;
}

export function OptionConfiguration({
  attributeSetIds,
  options,
  onToggleAttributeSet,
  onOptionChange,
  onAddOptionValue,
  onRegenerateVariants,
}: OptionConfigurationProps) {
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );
  const { allattributes, attributeLoading } = useSelector(
    (state: RootState) => state.adminAttributes,
  );
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const prevProduct = allProducts.find((item: any) => item._id === editId);

  if (attributeLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-slate-100 rounded-[2rem] shadow-inner italic">
        <div className="h-8 w-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin shadow-sm" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6">
          Loading Attributes...
        </span>
      </div>
    );
  }

  return (
    <SectionCard icon={<Layers size={18} strokeWidth={2.5} />} title="Option Configuration">
      <div className="space-y-8">
        {/* Attribute Set Grid */}
        <div className="flex flex-wrap gap-3">
          {allattributes.map((set) => {
            const active = attributeSetIds.includes(set.key || set._id!);
            return (
              <button
                type="button"
                key={set._id}
                onClick={() => onToggleAttributeSet(set.key || set._id!)}
                className={cn(
                  "px-5 py-2.5 border transition-all text-[10px] font-black uppercase tracking-widest rounded-xl italic",
                  active
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-slate-50 shadow-sm",
                )}
              >
                {set.name}
              </button>
            );
          })}
        </div>

        {options.length > 0 ? (
          <div className="space-y-8">
            {(() => {
              const groups: Record<
                string,
                {
                  name: string;
                  items: { opt: ProductOption; originalIdx: number }[];
                }
              > = {};

              options.forEach((opt, originalIdx) => {
                const setId = opt.attributeSetId || "other";
                if (!groups[setId]) {
                  const attributeSet = allattributes.find(
                    (s) => (s.key || s._id!) === setId,
                  );
                  groups[setId] = {
                    name: attributeSet?.name || "Common Attributes",
                    items: [],
                  };
                }
                groups[setId].items.push({ opt, originalIdx });
              });

              return Object.entries(groups).map(([setId, group]) => (
                <div key={setId} className="space-y-4">
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/40 whitespace-nowrap italic">
                      {group.name}
                    </span>
                    <div className="h-px flex-1 bg-slate-50" />
                  </div>

                  <div className="space-y-4">
                    {group.items.map(({ opt, originalIdx }) => (
                      <div
                        key={originalIdx}
                        className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl space-y-6 hover:border-primary/20 transition-all group/opt italic shadow-inner"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                          <div className="flex flex-col">
                            <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest italic">
                              {opt.label}
                            </span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic mt-1">
                              ID: {opt.key}
                            </span>
                          </div>

                          <label className="flex items-center gap-4 cursor-pointer group/label">
                            <span className="text-[10px] font-black text-slate-300 group-hover/label:text-primary transition-colors uppercase tracking-widest italic">
                              Enable for Variants
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="peer hidden"
                                checked={opt.useForVariants}
                                onChange={(e) => {
                                  onOptionChange(originalIdx, {
                                    ...opt,
                                    useForVariants: e.target.checked,
                                  });
                                }}
                              />
                              <div className="h-6 w-11 bg-slate-200 border border-slate-300 rounded-full peer-checked:bg-primary/10 peer-checked:border-primary/40 transition-all shadow-inner" />
                              <div className="absolute top-1 left-1 h-4 w-4 bg-white rounded-full peer-checked:bg-primary peer-checked:translate-x-5 transition-all shadow-sm" />
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {opt.values.map((val) => {
                            const selected = opt.selectedValues.includes(val);
                            const wasPrevSelected = prevProduct?.options
                              ?.find((item: any) => item.label === opt.label)
                              ?.selectedValues.includes(val);

                            return (
                              <button
                                type="button"
                                key={val}
                                onClick={() => {
                                  const exists =
                                    opt.selectedValues.includes(val);
                                  onOptionChange(originalIdx, {
                                    ...opt,
                                    selectedValues: exists
                                      ? opt.selectedValues.filter(
                                          (v) => v !== val,
                                        )
                                      : [...opt.selectedValues, val],
                                  });
                                }}
                                disabled={wasPrevSelected}
                                className={cn(
                                  "px-4 py-2 border text-[10px] font-black transition-all uppercase tracking-widest rounded-xl italic",
                                  selected
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-white border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20",
                                  wasPrevSelected &&
                                    "opacity-30 cursor-not-allowed border-dashed",
                                )}
                              >
                                {val}
                                {selected && !wasPrevSelected && (
                                  <span className="ml-2 inline-block h-1 w-1 bg-white rounded-full animate-pulse" />
                                )}
                              </button>
                            );
                          })}

                          <div className="flex-1 flex items-center gap-3 min-w-[250px]">
                            <input
                              value={opt.draftValue || ""}
                              onChange={(e) => {
                                onOptionChange(originalIdx, {
                                  ...opt,
                                  draftValue: e.target.value,
                                });
                              }}
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                onAddOptionValue(originalIdx)
                              }
                              placeholder="ADD NEW VALUE..."
                              className="flex-1 h-12 bg-white border border-slate-100 rounded-xl px-5 text-xs font-bold text-slate-900 uppercase tracking-widest placeholder:text-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner italic"
                            />
                            <button
                              type="button"
                              onClick={() => onAddOptionValue(originalIdx)}
                              className="h-12 w-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/30 rounded-xl transition-all shadow-sm active:scale-95"
                            >
                              <Plus size={20} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}

            <button
              type="button"
              onClick={onRegenerateVariants}
              className="w-full flex items-center justify-center gap-4 py-6 bg-white border-2 border-dashed border-slate-100 text-primary/40 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all group rounded-2xl italic active:scale-95 shadow-sm"
            >
              <Sparkles
                size={20}
                strokeWidth={2.5}
                className="group-hover:rotate-12 transition-transform"
              />
              Regenerate Variants Matrix
            </button>
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center gap-8 bg-slate-50 border border-dashed border-slate-100 rounded-[2.5rem] shadow-inner opacity-40 group hover:opacity-60 transition-opacity italic">
            <div className="h-24 w-24 rounded-3xl border border-slate-100 flex items-center justify-center bg-white shadow-sm">
              <Zap
                size={48}
                strokeWidth={2.5}
                className="text-slate-200 group-hover:text-primary transition-colors"
              />
            </div>
            <div className="text-center space-y-3">
              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">
                NO ATTRIBUTES MAPPED
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-300">
                Select attributes to begin configuration
              </p>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
