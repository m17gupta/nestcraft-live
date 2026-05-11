"use client";

import React, { useEffect, useState } from "react";
import { Terminal, FileSpreadsheet, Eye, ArrowRight, Package, User as UserIcon, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";


import { RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

export default function FormSubmissionsPage() {
  const dispatch = useAppDispatch();
  const {  allForms,isLoading } = useAppSelector((state: RootState) => state.adminForms);
  const { allProducts } = useAppSelector((state: RootState) => state.adminProducts);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);


 
  const getFormName = (id: string) => allForms.find((f: any) => f._id === id)?.name || "UNKNOWN FORM";
  const getProductName = (id: string) => allProducts.find((p: any) => p._id === id)?.name || "DIRECT ENTRY";

  return (
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-200 pb-10">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">Form <span className="text-primary">Submissions</span></h1>
           <p className="text-xs text-slate-400 font-black flex items-center gap-2 uppercase tracking-[0.2em]">
              <FileSpreadsheet size={14} className="text-primary" /> Reviewing incoming data entries and customer interactions.
           </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
          <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-lg shadow-primary/10" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Loading Submissions...
          </span>
        </div>
      ) : allForms.length === 0 ? (
        <div className="h-[50vh] border-2 border-dashed border-slate-200 rounded-none flex flex-col items-center justify-center gap-8 bg-white shadow-inner animate-in fade-in zoom-in-95 duration-700">
           <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center text-slate-200 shadow-inner">
            <FileSpreadsheet size={40} />
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              No Submissions Found
            </h3>
            <p className="max-w-xs text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">
              Awaiting first submission from your forms.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {allForms.map((sub: any) => (
            <div 
              key={sub._id}
              className="bg-white border border-slate-100 p-8 rounded-none shadow-sm hover:border-primary/20 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 rounded-none" />
              
              <div className="flex flex-col md:flex-row md:items-center gap-12 flex-1 relative z-10">
                <div className="flex flex-col space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Form Source</span>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-widest group-hover:text-primary transition-colors">
                    {getFormName(sub.formId)}
                  </span>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Linked Asset</span>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <Package size={14} className="text-primary/40" />
                    {getProductName(sub.productId)}
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Submitted On</span>
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <Calendar size={14} className="text-primary/40" />
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all text-[10px] font-black uppercase tracking-widest h-12 px-8 gap-3 rounded-none shadow-sm"
                  >
                    <Eye size={16} strokeWidth={2.5} /> View Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-2xl max-h-[85vh] overflow-y-auto rounded-none shadow-2xl p-0">
                   <div className="p-10 space-y-8">
                    <DialogHeader className="border-b border-slate-100 pb-8">
                      <DialogTitle className="text-3xl font-heading font-black uppercase tracking-tight">
                        Entry <span className="text-primary">Details</span>
                      </DialogTitle>
                      <div className="flex items-center gap-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                        <span>REF: #{sub._id.slice(-6).toUpperCase()}</span>
                        <span className="h-1 w-1 bg-slate-200 rounded-none" />
                        <span>SOURCE: {getFormName(sub.formId)}</span>
                      </div>
                    </DialogHeader>

                    <div className="space-y-6">
                      {sub.data && Object.entries(sub.data).map(([key, val]: [string, any]) => (
                        <div key={key} className="space-y-2.5 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] shadow-inner transition-all hover:border-primary/10">
                          <Label className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em]">
                            {key.replace(/-/g, ' ')}
                          </Label>
                          <div className="text-sm font-black text-slate-900 uppercase tracking-widest">
                            {Array.isArray(val) ? val.join(", ") : String(val)}
                          </div>
                        </div>
                      ))}

                      <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Registry Metadata</span>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none shadow-inner">
                               <span className="block text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1.5">User Identity</span>
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{sub.userId || "GUEST_USER"}</span>
                            </div>
                            {sub.productId && (
                               <div className="p-4 bg-slate-50 border border-slate-100 rounded-none shadow-inner">
                                  <span className="block text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Product Identity</span>
                                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{sub.productId}</span>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                   </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
