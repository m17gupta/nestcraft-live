"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  Download,
  FileJson,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<any>;
  sampleData: any[];
  title: string;
  description: string;
  fileName: string;
}

export function ImportModal({
  isOpen,
  onClose,
  onImport,
  sampleData,
  title,
  description,
  fileName,
}: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/json") {
      toast.error("Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setPreviewData(json.slice(0, 5));
          setFile(selectedFile);
        } else {
          toast.error("JSON must be an array of records.");
        }
      } catch (err) {
        toast.error("Failed to parse JSON file.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDownloadSample = () => {
    const dataStr = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = `${fileName}_sample.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", url);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const result = await onImport(json);
          toast.success(result.message || "Import completed successfully");
          handleClose();
        } catch (err: any) {
          toast.error(err.message || "Import failed.");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      toast.error("Failed to read file.");
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData([]);
    setIsImporting(false);
    onClose();
  };

  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-10 border-b border-slate-50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <FileJson size={120} />
          </div>
          <DialogTitle className="text-3xl font-heading font-black text-slate-900 uppercase tracking-tighter flex items-center gap-5 italic">
            <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <FileJson size={28} strokeWidth={2.5} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="p-10 space-y-8">
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] p-16 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-primary/30 hover:bg-slate-50 transition-all group shadow-inner"
            >
              <div className="h-20 w-20 bg-white text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all border border-slate-100 group-hover:border-primary/20 rounded-2xl flex items-center justify-center shadow-sm">
                <Upload size={36} strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest italic">
                  Select Import File
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Drag and drop or click to browse JSON datasets
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Ready to import
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                  onClick={removeFile}
                >
                  <X size={16} />
                </Button>
              </div>

              {previewData.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Preview (First {previewData.length} records)
                  </p>
                  <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                    <Table>
                      <TableHeader className="bg-slate-100/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                          <TableHead className="text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Name/Title
                          </TableHead>
                          <TableHead className="text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Identifier
                          </TableHead>
                          <TableHead className="text-right text-[9px] font-black uppercase text-slate-500 px-3 py-2">
                            Fields
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, idx) => (
                          <TableRow
                            key={idx}
                            className="border-slate-100 hover:bg-white transition-colors"
                          >
                            <TableCell className="text-[11px] font-bold text-slate-700 px-3 py-2">
                              {item.name || item.title || "Untitled"}
                            </TableCell>
                            <TableCell className="text-[10px] font-mono text-slate-500 px-3 py-2">
                              {item.sku || item.slug || item.key || "-"}
                            </TableCell>
                            <TableCell className="text-right text-[10px] text-slate-400 px-3 py-2 font-medium">
                              {Object.keys(item).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-50 pt-8">
            <button
              className="text-[10px] text-primary font-black uppercase tracking-widest italic flex items-center gap-4 hover:opacity-70 transition-all"
              onClick={handleDownloadSample}
            >
              <Download size={16} strokeWidth={2.5} /> Download Sample Template
            </button>
            <div className="flex items-center gap-4 text-[9px] text-slate-300 font-bold uppercase tracking-widest italic">
              <AlertCircle size={14} strokeWidth={2.5} className="text-amber-500" /> Existing items will be skipped
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50/50 p-10 border-t border-slate-100 flex items-center justify-end gap-6 sm:gap-0">
          <button
            onClick={handleClose}
            className="h-14 px-10 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all rounded-2xl shadow-sm italic"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="h-14 px-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-20 flex items-center gap-4 rounded-2xl ml-6 italic transition-all active:scale-95"
          >
            {isImporting ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              "Start Import"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
