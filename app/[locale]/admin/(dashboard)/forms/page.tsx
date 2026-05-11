"use client";

import React, { useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function FormsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allForms, isLoading } = useAppSelector(
    (state: RootState) => state.adminForms,
  );

  const handleDelete = async (id: string, name: string) => {
    // if (
    //   confirm(`Are you sure you want to delete form "${name.toUpperCase()}"?`)
    // ) {
    //   try {
    //     await dispatch(deleteForm(id)).unwrap();
    //     toast.success("Form deleted successfully");
    //   } catch (err) {
    //     toast.error("Failed to delete form");
    //   }
    // }
  };

  return (
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">Form <span className="text-primary">Matrix</span></h1>
           <p className="text-xs text-slate-400 font-black flex items-center gap-2 uppercase tracking-[0.2em]">
              <FileText size={14} className="text-primary" /> Manage custom forms and data collection.
           </p>
        </div>

        <Button
          onClick={() => router.push("/admin/forms/new")}
          className="h-14 px-10 bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-3 shadow-2xl shadow-primary/20 rounded-none"
        >
          <Plus size={18} strokeWidth={3} />
          Create New Form
        </Button>
      </div>

      {isLoading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
          <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-lg shadow-primary/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Synchronizing Form Registry...
          </span>
        </div>
      ) : allForms.length === 0 ? (
        <div className="h-[50vh] border-2 border-dashed border-slate-200 rounded-none flex flex-col items-center justify-center gap-8 bg-white shadow-inner animate-in fade-in zoom-in-95 duration-700">
          <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
            <FileText size={40} />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              No Forms Detected
            </h3>
            <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
              Your form directory is currently empty. Create your first form to start collecting data.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/forms/new")}
            className="text-primary hover:text-primary/80 uppercase text-[10px] font-black tracking-widest gap-3 hover:bg-primary/5 px-8 h-12 rounded-none transition-all"
          >
            Create First Form <ArrowRight size={16} strokeWidth={3} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allForms.map((form) => (
            <div
              key={form.id}
              className="bg-white border border-slate-100 p-8 rounded-none shadow-sm hover:border-primary/20 transition-all duration-500 group flex flex-col justify-between h-64 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -rotate-45 translate-x-16 -translate-y-16 rounded-none group-hover:scale-150 transition-transform duration-1000" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <FileText size={24} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-heading font-black text-slate-900 uppercase tracking-tight truncate w-40 group-hover:text-primary transition-colors">
                      {form.name}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {form.fields?.length || 0} Dynamic Fields
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                <div className="flex items-center gap-2 font-black text-[10px] text-slate-300 uppercase tracking-widest">
                  <span>REF:</span>
                  <span className="text-slate-400 font-bold">
                    #{form?.id?.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all shadow-sm"
                    onClick={() => router.push(`/admin/forms/${form.id}/edit`)}
                  >
                    <Edit size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-500/20 transition-all shadow-sm"
                    onClick={() => handleDelete(form?.id??"", form?.name??"")}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
