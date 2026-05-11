"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/components/admin/cms/ContentItem";
import { 
  Plus, 
  Trash, 
  Layers, 
  ChevronUp, 
  ChevronDown,
  LayoutGrid,
  ChevronRight,
  ChevronDown as ChevronDownIcon,
  Columns as ColumnsIcon,
  Zap,
  Maximize2,
  Terminal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

interface SectionBlockProps {
  section: any;
  onUpdate: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  section,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { config: brandConfig } = useAppSelector((state) => state.branding);
  const defaultLang = brandConfig?.languages?.default || "en";

  useEffect(() => {
    if (!section.columns || section.columns.length === 0) {
      const initialContent = section.content || [];
      onUpdate({ columns: [initialContent], content: [] });
    }
  }, []);

  const getColCount = (layout: string) => {
    switch (layout) {
      case "grid-1": return 1;
      case "grid-2": return 2;
      case "grid-3": return 3;
      case "grid-4": return 4;
      default: return 1;
    }
  };

  const handleLayoutChange = (newLayout: string) => {
    const newCount = getColCount(newLayout);
    const currentCols = section.columns || [[]];
    const newCols = [...currentCols];

    if (newCount > currentCols.length) {
      for (let i = currentCols.length; i < newCount; i++) {
        newCols.push([]);
      }
    } else if (newCount < currentCols.length) {
      const mergedContent = [...newCols[newCount - 1]];
      for (let i = newCount; i < currentCols.length; i++) {
        mergedContent.push(...currentCols[i]);
      }
      newCols[newCount - 1] = mergedContent;
      newCols.splice(newCount);
    }

    onUpdate({ layout: newLayout, columns: newCols });
  };

  const addContentElement = (type: string, colIndex: number = 0) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...(type === "heading" ? { level: "h2", text: { [defaultLang]: "New section heading" } } : {}),
      ...(type === "paragraph" ? { text: { [defaultLang]: "" } } : {}),
      ...(type === "image" ? { url: "", alt: { [defaultLang]: "" } } : {}),
      ...(type === "button" ? { buttons: [{ id: Math.random().toString(36).substr(2, 9), label: { [defaultLang]: "Action button" }, link: "#", actionType: "link" }] } : {}),
      ...(type === "list" ? { items: [{ [defaultLang]: "" }] } : {}),
      ...(type === "section" ? { layout: "grid-1", columns: [[]] } : {}),
      ...(type === "carousel" ? { items: [{ id: Math.random().toString(36).substr(2, 9), adminTitle: { [defaultLang]: "Slide item" }, layout: "grid-1", columns: [[]] }] } : {}),
      ...(type === "cta" ? { 
          title: { [defaultLang]: "" }, 
          subtitle: { [defaultLang]: "" }, 
          description: { [defaultLang]: "" }, 
          buttonLabel: { [defaultLang]: "" }, 
          buttonLink: "" 
      } : {}),
      ...(type === "cards" ? { items: [] } : {}),
      ...(type === "features" ? { items: [] } : {}),
      ...(type === "testimonial" ? { quote: { [defaultLang]: "" }, author: { [defaultLang]: "" }, role: { [defaultLang]: "" }, avatar: "" } : {}),
    };

    const newCols = [...(section.columns || [[]])];
    if (!newCols[colIndex]) newCols[colIndex] = [];
    newCols[colIndex] = [...newCols[colIndex], newItem];
    
    onUpdate({ columns: newCols });
    setIsOpen(true);
  };

  const updateItem = (itemId: string, colIndex: number, updates: any) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].map((item: any) =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ columns: newCols });
  };

  const removeItem = (itemId: string, colIndex: number) => {
    const newCols = [...(section.columns || [[]])];
    newCols[colIndex] = newCols[colIndex].filter((item: any) => item.id !== itemId);
    onUpdate({ columns: newCols });
  };

  const moveItem = (index: number, colIndex: number, direction: "up" | "down") => {
    const newCols = [...(section.columns || [[]])];
    const colContent = [...newCols[colIndex]];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= colContent.length) return;
    
    [colContent[index], colContent[targetIndex]] = [
      colContent[targetIndex],
      colContent[index],
    ];
    newCols[colIndex] = colContent;
    onUpdate({ columns: newCols });
  };

  const columns = section.columns || [section.content || []];
  const totalItemCount = columns.reduce((acc: number, col: any[]) => acc + (col?.length || 0), 0);

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 relative group/section transition-all hover:border-primary/30 shadow-sm border-l-[6px] border-l-primary">
      <div className="flex flex-wrap items-center justify-between gap-8 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-6 flex-1 min-w-[200px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-2xl shadow-inner"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDownIcon size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
          </Button>

          <div className="p-3 bg-primary/5 border border-primary/10 text-primary rounded-xl">
            <Layers size={20} strokeWidth={2.5} />
          </div>
          
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 leading-none italic">Layout Section</span>
              {!isOpen && totalItemCount > 0 && (
                 <span className="px-3 py-1 bg-primary/5 text-[9px] font-black text-primary uppercase tracking-[0.2em] rounded-lg border border-primary/10 italic">
                   {totalItemCount} Items Added
                 </span>
              )}
            </div>
            {isOpen ? (
              <Input 
                value={section.adminTitle || ""} 
                onChange={(e) => onUpdate({ adminTitle: e.target.value })} 
                placeholder="SECTION TITLE..." 
                className="h-12 bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-900 hover:border-primary/30 transition-all uppercase tracking-widest italic rounded-xl px-6 shadow-inner" 
              />
            ) : (
              <span className="text-[15px] font-black text-slate-900 uppercase tracking-tight truncate cursor-pointer hover:text-primary transition-colors italic" onClick={() => setIsOpen(true)}>
                {section.adminTitle || "Unnamed Section"}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="flex items-center bg-slate-50 border border-slate-100 p-1.5 rounded-xl shadow-inner">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-lg"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp size={18} strokeWidth={2.5} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-white transition-all rounded-lg"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown size={18} strokeWidth={2.5} />
            </Button>
          </div>

          <Select
            value={section.layout || "grid-1"}
            onValueChange={handleLayoutChange}
          >
            <SelectTrigger className="w-[160px] h-12 bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-900 uppercase tracking-widest rounded-xl focus:ring-2 focus:ring-primary/20 italic px-5 shadow-inner">
              <LayoutGrid size={16} strokeWidth={2.5} className="mr-3 text-primary" />
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-100 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl p-2 italic">
              <SelectItem value="grid-1" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">01 Column</SelectItem>
              <SelectItem value="grid-2" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">02 Columns</SelectItem>
              <SelectItem value="grid-3" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">03 Columns</SelectItem>
              <SelectItem value="grid-4" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">04 Columns</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 bg-white text-slate-300 hover:text-red-500 transition-all rounded-2xl border border-slate-100 hover:border-red-100 hover:bg-red-50 shadow-sm"
            onClick={onRemove}
          >
            <Trash size={20} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className={cn(
          "grid gap-6 animate-in fade-in duration-300",
          columns.length === 1 ? "grid-cols-1" : 
          columns.length === 2 ? "grid-cols-2" :
          columns.length === 3 ? "grid-cols-3" : "grid-cols-4"
        )}>
          {columns.map((col: any[], colIdx: number) => (
            <div key={colIdx} className={cn(
              "space-y-6 pb-6 relative",
              columns.length > 1 ? "border-r border-slate-50 last:border-r-0 pr-8 last:pr-0" : ""
            )}>
              {columns.length > 1 && (
                <div className="flex items-center gap-4 mb-6 bg-slate-50 border border-slate-100 p-3 rounded-xl w-fit shadow-inner">
                   <ColumnsIcon size={14} strokeWidth={2.5} className="text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Column {colIdx+1}</span>
                </div>
              )}
              
              <div className="space-y-4 min-h-[120px] bg-slate-50/50 p-4 border-2 border-slate-100 border-dashed rounded-[2rem] transition-colors hover:bg-slate-50">
                {(col || []).map((item: any, idx: number) => (
                  <ContentItem
                    key={item.id}
                    item={item}
                    onChange={(updates: any) => updateItem(item.id, colIdx, updates)}
                    onRemove={() => removeItem(item.id, colIdx)}
                    onMoveUp={() => moveItem(idx, colIdx, "up")}
                    onMoveDown={() => moveItem(idx, colIdx, "down")}
                    isFirst={idx === 0}
                    isLast={idx === (col?.length || 0) - 1}
                  />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-50 mt-6">
                 {[
                   { type: "heading", label: "Heading", icon: Plus },
                   { type: "paragraph", label: "Body Text", icon: Plus },
                   { type: "image", label: "Media Asset", icon: Plus },
                   { type: "section", label: "Advanced Grid", icon: Maximize2 },
                   { type: "button", label: "Interaction", icon: Zap },
                   { type: "carousel", label: "Media Stream", icon: Plus },
                   { type: "cards", label: "Dynamic Grid", icon: Plus },
                 ].map((act) => (
                    <button
                      key={act.type}
                      onClick={() => addContentElement(act.type, colIdx)}
                      className="px-4 py-3 bg-white border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all flex items-center gap-3 rounded-xl shadow-sm italic active:scale-95"
                    >
                      <act.icon size={14} strokeWidth={2.5} className="opacity-50" /> {act.label}
                    </button>
                 ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!isOpen && (
         <div className="flex items-center gap-4 opacity-30 italic">
            <Terminal size={14} strokeWidth={2.5} className="text-primary" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Section minimized</span>
         </div>
      )}
    </div>
  );
};
