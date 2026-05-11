"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  Trash,
  ChevronDown,
  ChevronUp,
  FileText,
  Layers,
  CreditCard,
  Zap,
  Quote,
  GalleryHorizontal,
  PlusCircle,
  Terminal,
  Activity,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionBlock } from "@/components/admin/cms/SectionBlock";
import { MediaLibraryModal } from "../media/MediaLibraryModal";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

interface ContentItemProps {
  item: any;
  onChange: (updates: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { config: brandConfig, isLoading: loading } = useAppSelector(
    (state) => state.branding,
  );

  const activeLanguages = brandConfig?.languages?.available?.filter(
    (l) => l.enabled,
  ) || [{ code: "en", name: "English", enabled: true }];
  const defaultLang = brandConfig?.languages?.default || "en";

  const getLocalizedValue = (val: any, langCode: string) => {
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      return val[langCode] || "";
    }
    if (langCode === defaultLang && typeof val === "string") {
      return val;
    }
    return "";
  };

  const updateLocalizedValue = (
    currentVal: any,
    langCode: string,
    newValue: string,
  ) => {
    const obj =
      typeof currentVal === "object" &&
      currentVal !== null &&
      !Array.isArray(currentVal)
        ? { ...currentVal }
        : { [defaultLang]: typeof currentVal === "string" ? currentVal : "" };

    obj[langCode] = newValue;
    return obj;
  };

  const getPreviewText = () => {
    switch (item.type) {
      case "heading":
        const hText = item.text;
        const previewH =
          typeof hText === "object"
            ? hText[defaultLang] || Object.values(hText)[0]
            : hText;
        return previewH || "No heading content";
      case "paragraph":
        const pText = item.text;
        const previewP =
          typeof pText === "object"
            ? pText[defaultLang] || Object.values(pText)[0]
            : pText;
        return previewP
          ? (previewP as string).length > 50
            ? (previewP as string).substring(0, 50).toUpperCase() + "..."
            : (previewP as string).toUpperCase()
          : "Empty text block";
      case "image":
        return item.url
          ? item.url.split("/").pop()?.toUpperCase() || "Image uploaded"
          : "No image uploaded";
      case "button":
        const btns = item.buttons || [];
        return btns.length > 0
          ? `${btns.length} Buttons configured`
          : "No buttons";
      case "carousel":
        return `${(item.items || []).length} Slides`;
      case "cards":
        return `${(item.items || []).length} Cards`;
      case "list":
        return `${(item.items || []).length} List items`;
      case "cta":
        const ctaTitle = item.title;
        const previewCTA =
          typeof ctaTitle === "object"
            ? ctaTitle[defaultLang] || Object.values(ctaTitle)[0]
            : ctaTitle;
        return previewCTA || "Call to action block";
      default:
        return "Active component";
    }
  };

  const renderFields = () => {
    switch (item.type) {
      case "carousel":
        return (
          <div className="space-y-8">
            {(item.items || []).map((slide: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative group/slide shadow-inner"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-primary text-[10px] font-black uppercase text-white rounded-lg italic">
                      Slide #{idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-primary/30 pointer-events-none uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </div>
                          <Input
                            value={getLocalizedValue(
                              slide.adminTitle,
                              lang.code,
                            )}
                            onChange={(e) => {
                              const newItems = [...item.items];
                              newItems[idx] = {
                                ...slide,
                                adminTitle: updateLocalizedValue(
                                  slide.adminTitle,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({ items: newItems });
                            }}
                            placeholder={`SLIDE TITLE (${lang.name})...`}
                            className="h-8 text-[11px] font-bold border-none bg-transparent p-0 w-full focus-visible:ring-0 text-slate-900 uppercase tracking-widest pl-10 italic"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    onClick={() => {
                      const newItems = item.items.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({ items: newItems });
                    }}
                  >
                    <Trash size={18} strokeWidth={2.5} />
                  </Button>
                </div>
                <div className="mt-4 border-l-4 border-primary pl-6 py-4 w-full bg-white rounded-xl shadow-sm">
                  <SectionBlock
                    section={slide}
                    onUpdate={(updates) => {
                      const newItems = [...item.items];
                      newItems[idx] = { ...slide, ...updates };
                      onChange({ items: newItems });
                    }}
                    onRemove={() => {
                      const newItems = item.items.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({ items: newItems });
                    }}
                    onMoveUp={() => {
                      if (idx === 0) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx - 1]] = [
                        newItems[idx - 1],
                        newItems[idx],
                      ];
                      onChange({ items: newItems });
                    }}
                    onMoveDown={() => {
                      if (idx === item.items.length - 1) return;
                      const newItems = [...item.items];
                      [newItems[idx], newItems[idx + 1]] = [
                        newItems[idx + 1],
                        newItems[idx],
                      ];
                      onChange({ items: newItems });
                    }}
                    isFirst={idx === 0}
                    isLast={idx === (item.items || []).length - 1}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full py-6 border-dashed border-slate-200 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-primary hover:border-primary/30 transition-all rounded-2xl gap-4 italic shadow-sm active:scale-95"
              onClick={() => {
                const newItems = [
                  ...(item.items || []),
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    adminTitle: "New slide item",
                    layout: "grid-1",
                    columns: [[]],
                  },
                ];
                onChange({ items: newItems });
              }}
            >
              <PlusCircle size={20} className="text-primary" strokeWidth={2.5} /> Add New Carousel Slide
            </Button>
          </div>
        );

      case "section":
        return (
          <div className="mt-4 border-l-4 border-primary pl-6 py-4 w-full bg-white rounded-2xl shadow-sm">
            <SectionBlock
              section={item}
              onUpdate={(updates) => onChange(updates)}
              onRemove={onRemove}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              isFirst={isFirst}
              isLast={isLast}
            />
          </div>
        );

      case "heading":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <Select
                value={item.level || "h1"}
                onValueChange={(val) => onChange({ level: val })}
              >
                <SelectTrigger className="w-[100px] h-12 bg-slate-50 border border-slate-100 text-[11px] font-black text-primary uppercase tracking-widest rounded-xl shadow-inner italic">
                  <SelectValue placeholder="SIZE" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-100 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl p-2 italic">
                  <SelectItem value="h1" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 01</SelectItem>
                  <SelectItem value="h2" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 02</SelectItem>
                  <SelectItem value="h3" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 03</SelectItem>
                  <SelectItem value="h4" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 04</SelectItem>
                  <SelectItem value="h5" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 05</SelectItem>
                  <SelectItem value="h6" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">SIZE 06</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 space-y-3">
                {activeLanguages.map((lang) => (
                  <div key={lang.code} className="relative group/lang">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 pointer-events-none uppercase group-focus-within/lang:text-primary transition-colors">
                      {lang.code}
                    </div>
                    <Input
                      placeholder={`ENTER SECTION HEADING (${lang.name})...`}
                      value={getLocalizedValue(item.text, lang.code)}
                      onChange={(e) =>
                        onChange({
                          text: updateLocalizedValue(
                            item.text,
                            lang.code,
                            e.target.value,
                          ),
                        })
                      }
                      className="h-12 bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-900 hover:border-primary/30 transition-all uppercase tracking-widest rounded-xl pl-12 shadow-inner italic"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div className="space-y-4">
            {activeLanguages.map((lang) => (
              <div key={lang.code} className="relative group/lang">
                <div className="absolute left-4 top-4 text-[9px] font-black text-primary/40 pointer-events-none uppercase group-focus-within/lang:text-primary transition-colors">
                  {lang.code}
                </div>
                <Textarea
                  placeholder={`ENTER BODY CONTENT (${lang.name})...`}
                  value={getLocalizedValue(item.text, lang.code)}
                  onChange={(e) =>
                    onChange({
                      text: updateLocalizedValue(
                        item.text,
                        lang.code,
                        e.target.value,
                      ),
                    })
                  }
                  className="min-h-[120px] bg-slate-50 border border-slate-100 text-[13px] font-bold text-slate-600 focus:border-primary/30 focus:bg-white transition-all rounded-2xl uppercase tracking-widest pl-12 pt-5 shadow-inner italic"
                />
              </div>
            ))}
          </div>
        );

      case "image":
        return (
          <div className="space-y-8">
            {!item.url ? (
              <MediaLibraryModal
                onSelect={(m) =>
                  onChange({ url: m.url, alt: m.alt || item.alt })
                }
                trigger={
                  <Button
                    variant="outline"
                    className="w-full h-48 border-2 border-dashed border-slate-100 bg-slate-50 text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-primary hover:border-primary/30 transition-all rounded-[2rem] flex flex-col gap-5 italic shadow-inner active:scale-95"
                  >
                    <ImageIcon size={32} strokeWidth={2.5} className="text-primary opacity-40" />
                    <span>Select Media Asset</span>
                  </Button>
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="relative group/img-preview border border-slate-100 bg-white rounded-[2.5rem] flex items-center justify-center min-h-[200px] max-h-[400px] overflow-hidden shadow-sm">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img-preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                    <div className="flex gap-4">
                      <MediaLibraryModal
                        onSelect={(m) =>
                          onChange({ url: m.url, alt: m.alt || item.alt })
                        }
                        trigger={
                          <Button className="h-12 bg-primary text-white px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all italic hover:bg-slate-900 shadow-xl shadow-primary/20">
                            <ImageIcon size={18} strokeWidth={2.5} className="mr-3" /> Update Media
                          </Button>
                        }
                      />
                      <Button
                        variant="destructive"
                        className="h-12 bg-white text-red-500 hover:bg-red-500 hover:text-white px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all italic shadow-xl"
                        onClick={() => onChange({ url: "", alt: "" })}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  {item.alt && activeLanguages.length > 0 && (
                    <div className="space-y-4 p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-4 italic ml-2">
                        <Terminal size={14} strokeWidth={2.5} className="text-primary" /> Media Description (Alt Text)
                      </p>
                      {activeLanguages.map((lang) => (
                        <div
                          key={lang.code}
                          className="flex items-center gap-4 group/lang"
                        >
                          <span className="text-[9px] font-black text-primary/30 w-6 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Input
                            placeholder={`ENTER ALT TEXT (${lang.name})...`}
                            value={getLocalizedValue(item.alt, lang.code)}
                            onChange={(e) =>
                              onChange({
                                alt: updateLocalizedValue(
                                  item.alt,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="h-10 bg-white border-slate-100 text-[11px] text-slate-900 font-bold rounded-xl shadow-sm italic uppercase tracking-widest focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "button":
        const buttonItems =
          item.buttons ||
          (item.label
            ? [
                {
                  id: "migrated",
                  label: item.label,
                  link: item.link,
                  actionType: "link",
                },
              ]
            : []);

        return (
          <div className="space-y-4">
            {buttonItems.map((btn: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-100 p-6 space-y-6 relative group/btn rounded-2xl shadow-inner"
              >
                <div className="flex items-center justify-between border-b border-slate-200/50 pb-4 mb-2">
                  <div className="flex items-center gap-5">
                    <span className="px-4 py-1.5 bg-primary text-[10px] font-black uppercase text-white rounded-lg italic tracking-widest">
                      Interaction #{idx + 1}
                    </span>
                    <Select
                      value={btn.actionType || "link"}
                      onValueChange={(val) => {
                        const newButtons = [...buttonItems];
                        newButtons[idx] = { ...btn, actionType: val };
                        onChange({
                          buttons: newButtons,
                          label: undefined,
                          link: undefined,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[160px] h-10 bg-white border-slate-100 text-[10px] font-black text-slate-900 uppercase tracking-widest rounded-xl shadow-sm italic px-4">
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-100 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl p-2 italic">
                        <SelectItem value="link" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">Navigation Path</SelectItem>
                        <SelectItem value="button" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">Action Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    onClick={() => {
                      const newButtons = buttonItems.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      onChange({
                        buttons: newButtons,
                        label: undefined,
                        link: undefined,
                      });
                    }}
                  >
                    <Trash size={18} strokeWidth={2.5} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                      Button Label
                    </label>
                    <div className="space-y-3">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 pointer-events-none uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </div>
                          <Input
                            placeholder={`LABEL (${lang.name})...`}
                            value={getLocalizedValue(btn.label, lang.code)}
                            onChange={(e) => {
                              const newButtons = [...buttonItems];
                              newButtons[idx] = {
                                ...btn,
                                label: updateLocalizedValue(
                                  btn.label,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({
                                buttons: newButtons,
                                label: undefined,
                                link: undefined,
                              });
                            }}
                            className="h-10 bg-white border border-slate-100 text-[11px] text-slate-900 font-black uppercase tracking-widest rounded-xl focus:border-primary/30 transition-all pl-12 shadow-sm italic"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {btn.actionType === "link" ? (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Destination URL (href)
                      </label>
                      <Input
                        placeholder="e.g. /services/consulting"
                        value={btn.link || ""}
                        onChange={(e) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, link: e.target.value };
                          onChange({
                            buttons: newButtons,
                            label: undefined,
                            link: undefined,
                          });
                        }}
                        className="h-12 bg-white border border-slate-100 text-[12px] text-slate-900 font-bold rounded-xl focus:border-primary/30 transition-all shadow-sm italic px-6"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Interaction Type
                      </label>
                      <Select
                        value={btn.buttonType || "button"}
                        onValueChange={(val) => {
                          const newButtons = [...buttonItems];
                          newButtons[idx] = { ...btn, buttonType: val };
                          onChange({
                            buttons: newButtons,
                            label: undefined,
                            link: undefined,
                          });
                        }}
                      >
                        <SelectTrigger className="h-12 bg-white border border-slate-100 text-[12px] text-slate-900 font-black uppercase tracking-widest rounded-xl italic px-6 shadow-sm">
                          <SelectValue placeholder="TYPE" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-100 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-2xl p-2 italic">
                          <SelectItem value="button" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">
                            Standard Button
                          </SelectItem>
                          <SelectItem value="submit" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">Submit Form</SelectItem>
                          <SelectItem value="reset" className="rounded-xl focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer py-3">Reset Form</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full py-6 border-dashed border-slate-200 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-primary hover:border-primary/30 transition-all rounded-2xl gap-4 italic shadow-sm active:scale-95"
              onClick={() => {
                const newButtons = [
                  ...buttonItems,
                  {
                    id: Math.random().toString(36).substr(2, 9),
                    label: "ACTION",
                    actionType: "link",
                    link: "#",
                  },
                ];
                onChange({
                  buttons: newButtons,
                  label: undefined,
                  link: undefined,
                });
              }}
            >
              <PlusCircle size={20} className="text-primary" strokeWidth={2.5} /> Add Secondary Interaction
            </Button>
          </div>
        );

      case "cta":
        case "cta":
          return (
            <div className="space-y-8 bg-slate-50 border border-slate-100 p-8 rounded-2xl shadow-inner italic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Main Heading
                      </label>
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Input
                            value={getLocalizedValue(item.title, lang.code)}
                            onChange={(e) =>
                              onChange({
                                title: updateLocalizedValue(
                                  item.title,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="h-10 bg-white border border-slate-100 text-[11px] text-slate-900 font-black uppercase tracking-widest pl-12 rounded-xl shadow-sm italic focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Secondary Heading
                      </label>
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Input
                            value={getLocalizedValue(item.subtitle, lang.code)}
                            onChange={(e) =>
                              onChange({
                                subtitle: updateLocalizedValue(
                                  item.subtitle,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="h-10 bg-white border border-slate-100 text-[11px] text-slate-900 font-black uppercase tracking-widest pl-12 rounded-xl shadow-sm italic focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                      Content Description
                    </label>
                    <div className="space-y-4">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <span className="absolute left-4 top-4 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Textarea
                            placeholder={`SYSTEM SUMMARY (${lang.name})...`}
                            value={getLocalizedValue(item.description, lang.code)}
                            onChange={(e) =>
                              onChange({
                                description: updateLocalizedValue(
                                  item.description,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="bg-white border border-slate-100 text-[12px] text-slate-600 font-bold min-h-[100px] pl-12 pt-4 rounded-2xl shadow-sm italic focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        CTA Button Label
                      </label>
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Input
                            value={getLocalizedValue(item.buttonLabel, lang.code)}
                            onChange={(e) =>
                              onChange({
                                buttonLabel: updateLocalizedValue(
                                  item.buttonLabel,
                                  lang.code,
                                  e.target.value,
                                ),
                              })
                            }
                            className="h-10 bg-white border border-slate-100 text-[11px] text-slate-900 font-black uppercase tracking-widest pl-12 rounded-xl shadow-sm italic focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Destination URL
                      </label>
                      <Input
                        value={item.buttonLink || ""}
                        onChange={(e) => onChange({ buttonLink: e.target.value })}
                        placeholder="e.g. /contact-us"
                        className="h-12 bg-white border border-slate-100 text-[12px] text-slate-900 font-bold rounded-xl shadow-sm px-6 italic focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ); case "cards": return (
            <div className="space-y-8">
              {(item.items || []).map((card: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 p-8 rounded-3xl relative group/card shadow-inner italic"
                >
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/50">
                    <span className="px-5 py-1.5 bg-primary text-[10px] font-black uppercase tracking-widest text-white rounded-lg italic">
                      Content Block #{idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => {
                        const newItems = item.items.filter(
                          (_: any, i: number) => i !== idx,
                        );
                        onChange({ items: newItems });
                      }}
                    >
                      <Trash size={18} strokeWidth={2.5} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                        Block Title
                      </label>
                      <div className="space-y-3">
                        {activeLanguages.map((lang) => (
                          <div key={lang.code} className="relative group/lang">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                              {lang.code}
                            </span>
                            <Input
                              placeholder={`TITLE (${lang.name})...`}
                              value={getLocalizedValue(card.title, lang.code)}
                              onChange={(e) => {
                                const newItems = [...item.items];
                                newItems[idx] = {
                                  ...card,
                                  title: updateLocalizedValue(
                                    card.title,
                                    lang.code,
                                    e.target.value,
                                  ),
                                };
                                onChange({ items: newItems });
                              }}
                              className="h-10 bg-white border border-slate-100 text-[11px] font-black text-slate-900 uppercase tracking-widest pl-12 rounded-xl shadow-sm italic focus:border-primary transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between ml-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic">
                          Media Mapping
                        </label>
                        <MediaLibraryModal
                          onSelect={(m) => {
                            const newItems = [...item.items];
                            newItems[idx] = { ...card, image: m.url };
                            onChange({ items: newItems });
                          }}
                          trigger={
                            <Button variant="link" className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary italic hover:text-slate-900">
                              Open Library
                            </Button>
                          }
                        />
                      </div>
                      <Input
                        placeholder="HTTPS://MEDIA-REPOSITORY.COM..."
                        value={card.image || ""}
                        onChange={(e) => {
                          const newItems = [...item.items];
                          newItems[idx] = { ...card, image: e.target.value };
                          onChange({ items: newItems });
                        }}
                        className="h-12 bg-white border border-slate-100 text-[12px] font-bold text-slate-900 rounded-xl px-6 italic shadow-sm focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 block italic ml-2">
                      Component Information
                    </label>
                    <div className="space-y-4">
                      {activeLanguages.map((lang) => (
                        <div key={lang.code} className="relative group/lang">
                          <span className="absolute left-4 top-4 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                            {lang.code}
                          </span>
                          <Textarea
                            placeholder={`BLOCK SUMMARY (${lang.name})...`}
                            value={getLocalizedValue(
                              card.description,
                              lang.code,
                            )}
                            onChange={(e) => {
                              const newItems = [...item.items];
                              newItems[idx] = {
                                ...card,
                                description: updateLocalizedValue(
                                  card.description,
                                  lang.code,
                                  e.target.value,
                                ),
                              };
                              onChange({ items: newItems });
                            }}
                            className="bg-white border border-slate-100 text-[12px] text-slate-600 font-bold min-h-[100px] pl-12 pt-4 rounded-2xl shadow-sm italic focus:border-primary transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full py-6 border-dashed border-slate-200 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-primary hover:border-primary/30 transition-all rounded-2xl gap-4 italic shadow-sm active:scale-95"
                onClick={() => {
                  const newItems = [
                    ...(item.items || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      title: { [defaultLang]: "NEW COMPONENT" },
                      description: { [defaultLang]: "" },
                      image: "",
                      link: "",
                    },
                  ];
                  onChange({ items: newItems });
                }}
              >
                <PlusCircle size={20} className="text-primary" strokeWidth={2.5} /> Add New Content Block
              </Button>
            </div>
            ); case "list": return (
            <div className="space-y-4">
              {(item.items || []).map((li: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-100 p-5 space-y-4 relative rounded-2xl shadow-inner italic"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-4">
                      <PlusCircle size={14} strokeWidth={2.5} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Sub-Feature #{idx + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      onClick={() => {
                        const newItems = (item.items || []).filter(
                          (_: any, i: number) => i !== idx,
                        );
                        onChange({ items: newItems });
                      }}
                    >
                      <Trash size={16} strokeWidth={2.5} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative group/lang">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                          {lang.code}
                        </span>
                        <Input
                          value={getLocalizedValue(li, lang.code)}
                          placeholder={`ENTER CONTENT ITEM (${lang.name})...`}
                          onChange={(e) => {
                            const newItems = [...(item.items || [])];
                            newItems[idx] = updateLocalizedValue(
                              li,
                              lang.code,
                              e.target.value,
                            );
                            onChange({ items: newItems });
                          }}
                          className="h-10 bg-white border border-slate-100 text-[11px] font-bold text-slate-900 rounded-xl shadow-sm italic focus:border-primary/30 transition-all uppercase tracking-widest pl-12"
                        />
                      </div>
                    ))}
                  </div>
                </div>
            ))}
              <Button
                variant="outline"
                className="w-full py-5 border-dashed border-slate-200 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-primary hover:border-primary/30 transition-all rounded-2xl gap-3 italic shadow-sm active:scale-95"
                onClick={() => {
                  const newItems = [...(item.items || []), "NEW CONTENT ITEM"];
                  onChange({ items: newItems });
                }}
              >
                <PlusCircle size={18} className="text-primary" strokeWidth={2.5} /> Add Sub-Feature
              </Button>
            </div>
        );

      default:
        return (
          <div className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 text-red-500 rounded-2xl shadow-sm italic">
            <ShieldCheck size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              UNKNOWN COMPONENT TYPE: SYSTEM ERROR
            </span>
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (item.type) {
      case "heading":
        return <Type size={18} />;
      case "paragraph":
        return <AlignLeft size={18} />;
      case "image":
        return <ImageIcon size={18} />;
      case "button":
        return <LinkIcon size={18} />;
      case "list":
        return <List size={18} />;
      case "section":
        return <Layers size={18} />;
      case "cta":
        return <Zap size={18} />;
      case "cards":
        return <CreditCard size={18} />;
      case "features":
        return <Zap size={18} />;
      case "testimonial":
        return <Quote size={18} />;
      case "carousel":
        return <GalleryHorizontal size={18} />;
      default:
        return <FileText size={18} />;
    }
  };

  if (item.type === "section") {
    return renderFields();
  }

  return (
    <div
      className={cn(
        "group relative bg-white border border-slate-100 rounded-[2.5rem] p-6 transition-all hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
        !isExpanded && "p-4",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-6 transition-all",
          isExpanded
            ? "mb-8 pb-6 border-b border-slate-50"
            : "mb-0 pb-0 border-b-0",
        )}
      >
        <div
          className="flex items-center gap-5 flex-1 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "transition-transform duration-300",
                isExpanded ? "rotate-0" : "-rotate-90",
              )}
            >
              <ChevronDown size={18} strokeWidth={2.5} className="text-primary opacity-40" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              {getIcon()}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-900 whitespace-nowrap italic">
                {item.type} Component
              </span>
              {!isExpanded && (
                <span className="text-[10px] font-bold text-slate-400 truncate italic">
                  — {getPreviewText()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5 opacity-40">
              <Activity size={10} strokeWidth={2.5} className="text-primary" />
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] italic">
                ID: {item.id}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 border border-slate-100 p-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 rounded-xl shadow-inner">
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

          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl border border-transparent hover:border-red-100 shadow-sm"
            onClick={onRemove}
          >
            <Trash size={20} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
          {renderFields()}
          <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gold/10 group-hover:bg-gold/40 transition-colors" />
        </div>
      )}
    </div>
  );
};
