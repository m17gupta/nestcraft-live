"use client";

import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Package, 
  Layers, 
  Info, 
  Database, 
  Globe, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight, 
  ChevronRight,
  DatabaseZap,
  CheckCircle2,
  AlertCircle,
  X,
  Container,
  Activity,
  Target,
  Terminal,
  Cpu,
  Radio,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startSync = async () => {
    setSyncing(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/sync-surplus", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to sync data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sync.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-primary/60">
            <RefreshCw size={16} strokeWidth={2.5} className="animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Platform Data Sync
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Catalog <span className="text-primary">Sync</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Sync global inventory assets with the{" "}
            <span className="text-primary font-black uppercase tracking-widest text-[9px] ring-1 ring-primary/10 px-4 py-1.5 bg-primary/5 rounded-none shadow-sm">
              Nestcraft Platform
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="flex flex-col items-end px-6 border-r border-slate-50">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Source Database</span>
              <span className="text-primary font-black flex items-center gap-3 text-[11px] uppercase tracking-widest">
                <Globe size={16} strokeWidth={2.5} /> SURPLUS DATABASE
              </span>
           </div>
           <div className="flex flex-col items-end px-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Connection Status</span>
              <span className="text-slate-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-3">
                 <CheckCircle size={16} strokeWidth={2.5} className="text-emerald-500" /> CONNECTED
              </span>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CONTROL COLUMN */}
        <div className="lg:col-span-1 space-y-10">
           <motion.div 
             className="relative bg-white border border-slate-100 p-10 rounded-none shadow-sm space-y-8 overflow-hidden group hover:border-primary/20 transition-all duration-500"
             whileHover={{ y: -5 }}
           >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -rotate-45 translate-x-16 -translate-y-16 transition-transform group-hover:scale-150 duration-700 rounded-none" />
              
              <div className="relative z-10 flex items-center gap-6">
                 <div className="h-16 w-16 rounded-[1.5rem] bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shadow-inner transition-all group-hover:bg-primary group-hover:text-white">
                    <DatabaseZap size={28} strokeWidth={2.5} />
                 </div>
                 <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">Sync Bridge</h3>
              </div>
              <p className="relative z-10 text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest border-l-2 border-primary/20 pl-8">
                Sync inventory assets and categories. Data integrity is automatically verified during the update.
              </p>
              <button 
                onClick={startSync}
                disabled={syncing}
                className={cn(
                  "relative z-10 w-full h-16 rounded-none flex items-center justify-center gap-5 font-black uppercase tracking-[0.3em] text-[11px] transition-all active:scale-95 shadow-xl shadow-primary/20",
                  syncing 
                    ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100 shadow-none" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {syncing ? <RefreshCw size={20} strokeWidth={3} className="animate-spin" /> : <Sparkles size={20} strokeWidth={2.5} />}
                {syncing ? "Updating Catalog..." : "Run Global Sync"}
              </button>
           </motion.div>

           <div className="bg-slate-50 border border-slate-100 p-10 rounded-none space-y-8 shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 mt-6 mr-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Cpu size={120} className="text-primary" />
              </div>
              <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Operational Stats</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-none bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                    <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Monitoring</span>
                 </div>
              </div>
              <div className="relative z-10 space-y-4">
                 {[
                   { label: "Inventory Density", val: "Optimized", icon: Layers },
                   { label: "Data Mapping", val: "Verified", icon: Zap },
                   { label: "Schema State", val: "Standardized", icon: Container },
                 ].map((meta, i) => (
                    <div key={i} className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0 group/item">
                       <div className="flex items-center gap-4 text-slate-400 group-hover/item:text-primary transition-colors">
                          <meta.icon size={18} strokeWidth={2.5} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{meta.label}</span>
                       </div>
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">{meta.val}</span>
                    </div>
                  ))}
               </div>
              <div className="pt-4">
                 <button className="w-full h-12 border border-slate-200 bg-white text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/[0.02] transition-all rounded-xl">Diagnostics Engine</button>
              </div>
           </div>
        </div>

        {/* RESULT COLUMN */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result || error ? (
               <motion.div
                 key="result"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className={cn(
                    "relative overflow-hidden p-12 rounded-none border shadow-2xl group min-h-[600px] transition-all duration-700",
                    error ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
                  )}
               >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 -rotate-45 translate-x-16 -translate-y-16 rounded-none" />
                  
                  <div className="flex items-center gap-8 mb-12 relative z-10">
                    <div className={cn(
                      "h-20 w-20 rounded-none flex items-center justify-center shadow-xl ring-1 ring-white/50 shadow-slate-200/50",
                      error ? "bg-red-500 text-white" : "bg-primary text-white"
                    )}>
                      {error ? <ShieldAlert size={40} strokeWidth={2.5} /> : <CheckCircle2 size={40} strokeWidth={2.5} />}
                    </div>
                    <div>
                        <h2 className={cn("text-3xl font-heading font-black uppercase tracking-tight", error ? "text-red-500" : "text-slate-900")}>
                          {error ? "Sync Failed" : "Sync Complete"}
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Report Timestamp {new Date().toLocaleTimeString()} // REF: #{Math.floor(Math.random()*9999)}</p>
                    </div>
                  </div>
                  
                  {result && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 border border-slate-100 p-10 rounded-none group/card hover:border-primary/20 transition-all shadow-inner">
                            <div className="h-14 w-14 bg-white text-slate-300 flex items-center justify-center rounded-none mb-6 border border-slate-100 group-hover/card:bg-primary group-hover/card:text-white transition-all shadow-sm group-hover/card:scale-110"><Package size={24} /></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Resources Ingested</h4>
                            <div className="flex items-baseline gap-4">
                               <p className="text-7xl font-heading font-black text-slate-900 tracking-tighter">{result.count}</p>
                               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Success</span>
                            </div>
                        </div>
                        <div className="bg-primary border border-primary/20 p-10 rounded-none shadow-xl shadow-primary/10 flex flex-col justify-center text-white">
                            <div className="flex items-center gap-3 mb-4 opacity-60">
                               <Radio size={14} className="animate-pulse" />
                               <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Status</h4>
                            </div>
                            <p className="text-2xl font-heading font-black uppercase tracking-tight leading-tight">Catalog Sync Complete</p>
                        </div>
                      </div>
                      
                      <div className="p-8 bg-slate-50 border border-slate-100 rounded-none flex items-start gap-6 border-l-4 border-l-primary/40 shadow-inner">
                        <Activity size={24} className="text-primary flex-shrink-0 mt-1 animate-pulse" />
                        <div className="space-y-3">
                           <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                              The store database has been successfully updated.
                           </p>
                           <div className="flex gap-6">
                              <a href="/admin/products" className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-slate-900 transition-all flex items-center gap-2">View Catalog <ArrowUpRight size={14} /></a>
                              <a href="/admin/categories" className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-slate-900 transition-all flex items-center gap-2">View Categories <ArrowUpRight size={14} /></a>
                           </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                         <Button onClick={() => setResult(null)} variant="ghost" className="h-12 px-10 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-all rounded-xl">Clear Report</Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="animate-in slide-in-from-top-4 duration-500 relative z-10 space-y-10">
                       <div className="bg-white border border-red-100 p-10 rounded-none shadow-xl shadow-red-500/5 space-y-6">
                          <div className="flex items-center gap-4">
                             <ShieldAlert className="text-red-500" size={24} />
                             <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500">Sync Error Log</h4>
                          </div>
                          <p className="text-sm font-bold text-slate-600 leading-tight uppercase tracking-widest">{error}</p>
                          <div className="pt-6 border-t border-slate-100">
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                               The sync process was interrupted. Ensure network connection is stable and try again.
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-6">
                          <Button onClick={startSync} className="h-16 px-12 bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 rounded-none flex items-center gap-4"><RefreshCw size={20} /> Retry Sync</Button>
                          <Button onClick={() => setError(null)} variant="ghost" className="h-16 px-10 border border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-900 transition-all rounded-none">Dismiss Error</Button>
                       </div>
                    </div>
                  )}
                </motion.div>
             ) : (
                <motion.div 
                   key="idle"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full min-h-[600px] rounded-none border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-20 bg-white shadow-inner group transition-all duration-700"
                >
                  <div className="relative mb-12">
                     <div className="absolute inset-0 bg-primary/5 rounded-none blur-3xl scale-150 animate-pulse" />
                     <Sparkles size={100} className="text-slate-100 group-hover:text-primary/10 transition-colors duration-1000 relative z-10" strokeWidth={0.5} />
                     <RefreshCw size={32} className="absolute -top-6 -right-6 text-primary opacity-10 group-hover:opacity-30 group-hover:rotate-180 transition-all duration-1000" />
                  </div>
                  <h2 className="text-4xl font-heading font-black uppercase tracking-tight text-slate-200 group-hover:text-slate-300 transition-colors">Awaiting Catalog Update</h2>
                  <p className="max-w-md text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 leading-relaxed group-hover:text-slate-500 transition-colors">
                    Sync local catalog database with remote.
                  </p>
                  <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <Button onClick={startSync} className="h-16 px-12 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 rounded-none">Execute Sync</Button>
                  </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
