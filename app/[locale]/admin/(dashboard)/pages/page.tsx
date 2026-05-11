"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchPagesThunk, deletePageThunk } from "@/lib/store/pages/pageThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  Globe,
  FileText,
  ShieldAlert,
  Database,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Page } from "@/lib/store/pages/pageType";

function PagesPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const { allPages: pages, isLoading: loading } = useSelector(
    (state: RootState) => state.pages
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPagesThunk());
  }, [dispatch]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`CONFIRM DELETION: Are you sure you want to remove the page "${title}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`DELETING ${title}...`);

    try {
      const resultAction = await dispatch(deletePageThunk(id));
      if (deletePageThunk.fulfilled.match(resultAction)) {
        toast.success(`${title} REMOVED SUCCESSFULLY`, { id: toastId });
      } else {
        toast.error(`DELETION FAILED: ${resultAction.payload || "Unauthorized Access"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("NETWORK ERROR. PLEASE RETRY.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-12 p-8 md:p-12 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-primary/60">
            <Database size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Global Content Repository
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Pages <span className="text-primary">Management</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Interface for multi-channel content management and architectural orchestration.
          </p>
        </div>
        <Button
          className="h-16 px-10 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-900 transition-all shadow-2xl shadow-primary/20 rounded-none active:scale-95"
          onClick={() => router.push("/admin/pages/new")}
        >
          <Plus className="h-5 w-5" strokeWidth={3} /> Create New Content
        </Button>
      </div>

      {/* Content Table Container */}
      <div className="bg-white border border-slate-100 rounded-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] py-8 pl-10">
                Content Title
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">
                URL Identifier
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">
                Publication Status
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px]">
                Last Synchronization
              </TableHead>
              <TableHead className="text-right font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] pr-10">
                Operations
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-80">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-12 w-12 animate-spin border-4 border-slate-100 border-t-primary rounded-none" />
                    <span className="text-[10px] text-primary font-black uppercase tracking-[0.4em]">
                      Synchronizing Repository...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-80"
                >
                  <div className="flex flex-col items-center gap-5 opacity-20">
                    <ShieldAlert size={60} className="text-slate-400" strokeWidth={2.5} />
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Storage Empty. No content records identified.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page: Page) => (
                <TableRow
                  key={page._id || Math.random().toString()}
                  className="hover:bg-slate-50/50 border-slate-100 transition-all group"
                >
                  <TableCell className="py-8 pl-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-none flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-inner">
                        <FileText size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-900 text-[13px] uppercase tracking-widest group-hover:text-primary transition-colors">
                          {(page?.title as any)?.[locale] || page?.title?.en || "Untitled Page"}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Globe size={12} className="text-primary/60" strokeWidth={2.5} />
                          <span>/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-black text-[10px] text-slate-400 uppercase tracking-widest">
                    /{page.slug}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div
                        className={`w-3 h-3 rounded-none ${page.isPublished ? "bg-emerald-500 shadow-[0_0_12px_#10b981]" : "bg-slate-200"}`}
                       />
                       <span
                         className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                           page.isPublished
                             ? "text-emerald-600"
                             : "text-slate-400"
                         }`}
                       >
                         {page.isPublished ? "Published" : "Draft"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                    {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all rounded-xl border border-slate-100 hover:border-primary/20 shadow-sm"
                        onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                      >
                        <Edit className="h-5 w-5" strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-11 w-11 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all rounded-xl border border-slate-100 hover:border-red-500/20 shadow-sm"
                        disabled={deletingId === page._id}
                        onClick={() =>
                          page._id &&
                          handleDelete(page._id, page.title?.en || "Untitled")
                        }
                      >
                        <Trash className="h-5 w-5" strokeWidth={2.5} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Status */}
      <div className="flex items-center gap-4 text-primary/40 pl-2">
         <Terminal size={16} strokeWidth={2.5} />
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">System Core: Authorized Management Access</span>
      </div>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin border-4 border-slate-100 border-t-primary rounded-none" />
       </div>
    }>
      <PagesPageContent />
    </Suspense>
  );
}
