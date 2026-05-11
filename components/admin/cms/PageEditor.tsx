"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionBlock } from "./SectionBlock";
import {
  Save,
  PlusCircle,
  Settings,
  Layout,
  Eye,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Page, PageBlock } from "@/lib/store/pages/pageType";
import { useAppSelector } from "@/lib/store/hooks";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageEditorProps {
  initialData?: Page;
  onSave: (page: Page) => Promise<void>;
  isLoading?: boolean;
}

export const PageEditor: React.FC<PageEditorProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const { config: brandConfig } = useAppSelector((state) => state.branding);
  const activeLanguages = brandConfig?.languages?.available?.filter(
    (l) => l.enabled,
  ) || [{ code: "en", name: "English", enabled: true }];
  const defaultLang = brandConfig?.languages?.default || "en";

  const [page, setPage] = useState<Page>(
    initialData || {
      title: "" as any,
      slug: "",
      content: [],
      metaTitle: "" as any,
      metaDescription: "" as any,
      isPublished: false,
    },
  );


  const router = useRouter();

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

  const addSection = () => {
    const newSection: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: "section",
      adminTitle: "New content section",
      content: [],
      layout: "grid-1",
      columns: [[]],
    };
    if (Array.isArray(page.content)) {
      setPage({ ...page, content: [...page.content, newSection] });
    }
  };

  const updateSection = (sectionId: string, updates: any) => {
    if (Array.isArray(page.content)) {
      setPage({
        ...page,
        content: page.content.map((sec: PageBlock) =>
          sec.id === sectionId ? { ...sec, ...updates } : sec,
        ),
      });
    }
  };

  const removeSection = (sectionId: string) => {
    if (Array.isArray(page.content)) {
      setPage({
        ...page,
        content: page.content.filter((sec: PageBlock) => sec.id !== sectionId),
      });
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (Array.isArray(page.content)) {
      const newContent = [...page.content];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newContent.length) return;

      [newContent[index], newContent[targetIndex]] = [
        newContent[targetIndex],
        newContent[index],
      ];
      setPage({ ...page, content: newContent });
    }
  };

  const handleSave = async () => {
    if (!page.title || !page.slug) {
      toast.error("ERROR: Content title and URL identifier are mandatory.");
      return;
    }
    await onSave(page);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-100 pb-10 gap-8">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all rounded-2xl shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
          </Button>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-primary/60">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                Content Architecture Engine
              </span>
            </div>
            <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none italic">
              {initialData ? "Edit" : "Create"} <span className="text-primary">Content</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 bg-white p-2 px-6 border border-slate-100 rounded-2xl shadow-sm">
            <Label
              htmlFor="publish-toggle"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 cursor-pointer italic"
            >
              {page.isPublished ? "Published Status" : "Internal Draft"}
            </Label>
            <Switch
              id="publish-toggle"
              checked={page.isPublished}
              onCheckedChange={(val: boolean) =>
                setPage({ ...page, isPublished: val })
              }
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>

          <Button
            variant="outline"
            className="h-16 px-10 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] gap-3 italic active:scale-95"
            disabled={isLoading}
          >
            <Eye className="h-5 w-5 text-primary" strokeWidth={2.5} /> Live Preview
          </Button>

          <Button
            className="h-16 px-10 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-900 transition-all shadow-2xl shadow-primary/20 rounded-2xl italic active:scale-95 gap-3"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin border-2 border-white/20 border-t-white rounded-full" />
            ) : (
              <Save className="h-5 w-5" strokeWidth={2.5} />
            )}
            {initialData ? "Save Changes" : "Publish Content"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="flex gap-4 mb-8 bg-transparent h-auto p-0">
          <TabsTrigger
            value="content"
            className="px-10 py-4 rounded-2xl border border-slate-100 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all flex gap-3 italic shadow-sm"
          >
            <Layout size={18} strokeWidth={2.5} /> Content Design
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="px-10 py-4 rounded-2xl border border-slate-100 bg-white text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary transition-all flex gap-3 italic shadow-sm"
          >
            <Settings size={18} strokeWidth={2.5} /> Search Strategy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-10 outline-none">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Terminal size={160} className="text-primary" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block italic ml-2">
                    Content Title
                  </Label>
                  <div className="space-y-3">
                    {activeLanguages.map((lang) => (
                      <div key={lang.code} className="relative group/lang">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                          {lang.code}
                        </span>
                        <Input
                          placeholder={`e.g. Home Page Architecture (${lang.name})`}
                          value={getLocalizedValue(page.title, lang.code)}
                          onChange={(e) =>
                            setPage({
                              ...page,
                              title: updateLocalizedValue(
                                page.title,
                                lang.code,
                                e.target.value,
                              ) as any,
                            })
                          }
                          className="h-14 bg-slate-50 border-slate-100 rounded-2xl text-slate-900 font-bold uppercase tracking-widest focus:border-primary focus:bg-white transition-all pl-16 shadow-inner italic"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block italic ml-2">
                    URL Identifier (Slug)
                  </Label>
                  <div className="flex items-center">
                    <div className="bg-slate-50 border border-r-0 border-slate-100 h-16 px-6 flex items-center text-slate-400 text-[11px] font-black rounded-l-2xl shadow-inner">
                      /
                    </div>
                    <Input
                      placeholder="page-url-identifier"
                      value={page.slug}
                      onChange={(e) =>
                        setPage({
                          ...page,
                          slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                        })
                      }
                      className="h-16 bg-slate-50 border-slate-100 rounded-l-none rounded-r-2xl text-slate-900 font-bold focus:border-primary focus:bg-white transition-all shadow-inner uppercase tracking-widest italic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
              <div className="flex items-center gap-4">
                <Zap className="text-primary" size={20} strokeWidth={2.5} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic">
                  Page Layout
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addSection}
                className="h-12 px-8 bg-white border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] italic shadow-sm active:scale-95"
              >
                <PlusCircle size={16} className="mr-3" strokeWidth={2.5} /> Insert Component
              </Button>
            </div>

            {Array.isArray(page.content) && page.content.length === 0 ? (
              <div className="h-[400px] border-2 border-dashed border-slate-100 bg-white rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-8 shadow-inner italic">
                <Layout size={80} className="opacity-[0.05]" strokeWidth={2.5} />
                <div className="text-center space-y-3">
                  <p className="text-[12px] font-black uppercase tracking-[0.4em]">
                    Editor empty
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                    Add a section to start building your page.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="h-14 px-10 bg-slate-50 border border-slate-100 text-primary hover:bg-primary hover:text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all italic shadow-sm active:scale-95"
                  onClick={addSection}
                >
                  Create First Section
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {Array.isArray(page.content) &&
                  page.content.map((section: PageBlock, idx: number) => (
                    <SectionBlock
                      key={section.id}
                      section={section}
                      onUpdate={(updates: any) =>
                        updateSection(section.id, updates)
                      }
                      onRemove={() => removeSection(section.id)}
                      onMoveUp={() => moveSection(idx, "up")}
                      onMoveDown={() => moveSection(idx, "down")}
                      isFirst={idx === 0}
                      isLast={idx === page.content.length - 1}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-110 duration-700" />
            <div className="flex-1 space-y-6 relative z-10">
              <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary border-b border-slate-50 pb-4 inline-block italic">
                Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="flex gap-5">
                  <span className="text-4xl font-heading font-black text-slate-100 group-hover:text-primary/10 transition-colors">01</span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-relaxed italic mt-2">
                    Add **Sections** to establish the core layout hierarchy.
                  </p>
                </div>
                <div className="flex gap-5">
                  <span className="text-4xl font-heading font-black text-slate-100 group-hover:text-primary/10 transition-colors">02</span>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-relaxed italic mt-2">
                    Insert **Components** (Text, Imagery) within section grids.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-12 outline-none">
          <div className="max-w-4xl bg-white border border-slate-100 p-12 rounded-[2.5rem] shadow-sm space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck size={160} className="text-primary" />
            </div>

            <div className="flex items-center gap-4 border-b border-slate-50 pb-6 relative z-10">
              <ShieldCheck className="text-primary" size={20} strokeWidth={2.5} />
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em] italic">
                Search Engine <span className="text-primary">Optimization</span> (SEO)
              </h3>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block italic ml-2">
                  Search Engine Title
                </Label>
                <div className="space-y-3">
                  {activeLanguages.map((lang) => (
                    <div key={lang.code} className="relative group/lang">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                        {lang.code}
                      </span>
                      <Input
                        placeholder={`Content title for indexing (${lang.name})`}
                        value={getLocalizedValue(page.metaTitle, lang.code)}
                        onChange={(e) =>
                          setPage({
                            ...page,
                            metaTitle: updateLocalizedValue(
                              page.metaTitle,
                              lang.code,
                              e.target.value,
                            ) as any,
                          })
                        }
                        className="bg-slate-50 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-primary focus:bg-white h-14 pl-16 shadow-inner italic"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 block italic ml-2">
                  Meta Description
                </Label>
                <div className="space-y-4">
                  {activeLanguages.map((lang) => (
                    <div key={lang.code} className="relative group/lang">
                      <span className="absolute left-5 top-5 text-[9px] font-black text-primary/40 uppercase group-focus-within/lang:text-primary transition-colors">
                        {lang.code}
                      </span>
                      <Textarea
                        placeholder={`Search-optimized summary for global indexing (${lang.name})`}
                        value={getLocalizedValue(
                          page.metaDescription,
                          lang.code,
                        )}
                        onChange={(e) =>
                          setPage({
                            ...page,
                            metaDescription: updateLocalizedValue(
                              page.metaDescription,
                              lang.code,
                              e.target.value,
                            ) as any,
                          })
                        }
                        className="bg-slate-50 border-slate-100 rounded-2xl text-slate-900 font-bold focus:border-primary focus:bg-white min-h-[120px] p-5 pl-16 shadow-inner italic"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
