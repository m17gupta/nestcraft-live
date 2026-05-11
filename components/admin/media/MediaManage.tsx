"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Link2,
  X,
  Search,
  Image as ImageIcon,
  Clock,
  Trash2,
  Plus,
  Terminal,
  Database,
  Layers,
  FileText,
  Type,
  File as FileIcon,
} from "lucide-react";

export const MediaUploader = ({
  onSelect,
  hideHeader = false,
}: {
  onSelect?: (item: any) => void;
  hideHeader?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [uploadMethod, setUploadMethod] = useState<string>("file");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const getFileType = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) return "image";
    if (ext === "svg") return "svg";
    if (ext === "pdf") return "pdf";
    if (["woff", "woff2", "ttf", "otf"].includes(ext)) return "font";
    return "other";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const fileObjects = files.map((file: File) => {
      const type = getFileType(file.name);
      return {
        file,
        filename: file.name,
        alt: "",
        preview: (type === "image" || type === "svg") ? URL.createObjectURL(file) : null,
        size: (file.size / 1024).toFixed(0) + " KB",
        foldername: "",
        type,
      };
    });
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files);
    const fileObjects = files.map((file: File) => {
      const type = getFileType(file.name);
      return {
        file,
        filename: file.name,
        alt: "",
        preview: (type === "image" || type === "svg") ? URL.createObjectURL(file) : null,
        size: (file.size / 1024).toFixed(0) + " KB",
        foldername: "",
        type,
      };
    });
    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const updateFileMetadata = (index: number, field: string, value: string) => {
    const updated = [...selectedFiles];
    updated[index][field] = value;
    setSelectedFiles(updated);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const newMedia = selectedFiles.map((file: any, idx: number) => ({
      id: mediaLibrary.length + idx + 1,
      filename: file.filename,
      url: file.preview,
      alt: file.alt || file.filename,
      file: file.file,
      foldername: file.foldername ? file.foldername : "Uncategorized",
      type: file.type,
    }));

    const formData: any = new FormData();
    for (let i of newMedia) {
      formData.append("files", i.file);
      formData.append("name", i.filename);
      formData.append("altText", i.alt);
      formData.append("foldername", i.foldername);
    }

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMediaLibrary([...data.data, ...mediaLibrary]);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUrlUpload = () => {
    if (!urlInput) return;

    const newMedia = {
      id: mediaLibrary.length + 1,
      name: "Image from URL",
      url: urlInput,
      alt: "Image from URL",
      date: new Date().toISOString().split("T")[0],
      size: "N/A",
    };

    setMediaLibrary([newMedia, ...mediaLibrary]);
    setUrlInput("");
  };

  const folders = Array.from(
    new Set(
      mediaLibrary
        .map((item: any) => item.foldername)
        .filter((name) => name && name.trim() !== ""),
    ),
  ).sort();

  const filteredMedia = mediaLibrary.filter((item: any) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === null || item.foldername === selectedFolder;

    return matchesSearch && matchesFolder;
  });

  useEffect(() => {
    async function getMedia() {
      const response = await fetch("/api/admin/media");
      const data = await response.json();
      if (data.success) {
        setMediaLibrary(data.data);
      }
    }
    getMedia();
  }, []);

  return (
    // <div className="min-h-screen bg-ink p-4 md:p-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full mx-auto"
    >
      {/* Header Section */}
      {!hideHeader && (
        <div className="mb-12 border-b border-slate-100 pb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary/60">
                <Database size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                  Centralized Asset Bridge
                </span>
              </div>
              <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none italic">
                Media <span className="text-primary">Library</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-3">
                Centralized digital asset management and global distribution framework.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm self-start">
          {["upload", "library"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl italic ${
                activeTab === tab
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:text-primary hover:bg-slate-50"
              }`}
            >
              {tab === "upload" ? "Upload Assets" : "Asset Gallery"}
            </button>
          ))}
        </div>

        {activeTab === "library" && (
          <div className="flex-1 relative group">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all"
              size={20}
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Search assets by name or metadata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-[13px] font-black text-slate-900 placeholder:text-slate-200 focus:outline-none focus:border-primary/50 transition-all shadow-sm uppercase tracking-widest"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="flex gap-3 p-2 bg-white border border-slate-100 w-fit rounded-2xl shadow-sm">
              {[
                { value: "file", icon: Upload, label: "Local Files" },
                { value: "url", icon: Link2, label: "Remote URL" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setUploadMethod(value)}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${
                    uploadMethod === value
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5"
                      : "text-slate-400 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                  {label}
                </button>
              ))}
            </div>

            {uploadMethod === "file" ? (
              <div className="space-y-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="relative bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 text-center cursor-pointer transition-all hover:border-primary/50 group shadow-inner overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/*,.svg,.pdf,.woff,.woff2,.ttf,.otf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-24 h-24 mx-auto mb-8 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm">
                    <Upload
                      className="text-slate-300 group-hover:text-primary transition-all"
                      size={40}
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="text-xl font-black text-slate-900 uppercase tracking-[0.2em] mb-3 italic">
                    Upload Digital Assets
                  </p>
                  <p className="text-[11px] text-slate-400 uppercase tracking-[0.3em] font-bold italic">
                    Drag and drop files here or browse local storage • Max 100MB
                  </p>
                </motion.div>

                {selectedFiles.length > 0 && (
                  <motion.div className="space-y-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-white border border-slate-100 p-6 flex gap-8 rounded-[2rem] shadow-sm italic"
                      >
                        <div className="w-28 h-28 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-2xl shadow-inner">
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-primary/40">
                                {file.type === "font" && <Type size={36} strokeWidth={2.5} />}
                                {file.type === "pdf" && <FileText size={36} strokeWidth={2.5} />}
                                {file.type === "other" && <FileIcon size={36} strokeWidth={2.5} />}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest truncate max-w-sm">
                                {file.filename}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                {file.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="h-10 w-10 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center rounded-xl"
                            >
                              <X size={20} strokeWidth={2.5} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                              type="text"
                              value={file.alt}
                              onChange={(e) =>
                                updateFileMetadata(index, "alt", e.target.value)
                              }
                              placeholder="ALT TEXT (SEO)..."
                              className="bg-slate-50 border border-slate-100 p-4 text-[11px] font-bold text-slate-900 focus:border-primary/50 outline-none uppercase tracking-widest rounded-xl shadow-inner italic"
                            />
                            <input
                              type="text"
                              value={file.foldername}
                              onChange={(e) =>
                                updateFileMetadata(
                                  index,
                                  "foldername",
                                  e.target.value,
                                )
                              }
                              placeholder="FOLDER NAME..."
                              className="bg-slate-50 border border-slate-100 p-4 text-[11px] font-bold text-slate-900 focus:border-primary/50 outline-none uppercase tracking-widest rounded-xl shadow-inner italic"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleUpload}
                      className="w-full py-6 bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-slate-900 transition-all shadow-xl shadow-primary/20 rounded-2xl italic active:scale-[0.98]"
                    >
                      Upload & Synchronize Assets ({selectedFiles.length} Items)
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 italic">
                  Remote Asset Source (URL)
                </label>
                <div className="flex flex-col md:flex-row gap-6">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://cloud.assets.com/resource.jpg"
                    className="flex-1 bg-slate-50 border border-slate-100 p-5 text-[13px] font-bold text-slate-900 focus:border-primary/50 outline-none uppercase tracking-widest rounded-2xl shadow-inner"
                  />
                  <button
                    onClick={handleUrlUpload}
                    className="px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.3em] text-[11px] hover:bg-primary/90 transition-all flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-primary/20 italic active:scale-95"
                  >
                    <Plus size={20} strokeWidth={3} /> Import Asset
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {folders.length > 0 && (
              <div className="flex flex-wrap gap-3 pb-6 border-b border-slate-50">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl italic ${
                    selectedFolder === null
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white text-slate-400 border border-slate-100 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  All Folders
                </button>
                {folders.map((folder: any) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl italic ${
                      selectedFolder === folder
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-white text-slate-400 border border-slate-100 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence>
                {filteredMedia.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedMedia(item)}
                    className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-sm"
                  >
                    <div className="aspect-square bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center">
                      {item.type === "font" || item.type === "pdf" || item.type === "other" ? (
                        <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:text-primary transition-colors">
                           {item.type === "font" && <Type size={40} strokeWidth={2.5} />}
                           {item.type === "pdf" && <FileText size={40} strokeWidth={2.5} />}
                           {item.type === "other" && <FileIcon size={40} strokeWidth={2.5} />}
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-60 italic">
                             {item.filename.split('.').pop()} Asset
                           </span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.alt}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all group-hover:scale-110 duration-700"
                        />
                      )}
                    </div>
                    <div className="p-5 bg-white">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate italic">
                        {item.filename}
                      </p>
                      <div className="flex items-center gap-3 mt-2 opacity-50">
                        <Clock size={12} className="text-primary" strokeWidth={2.5} />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {(item.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                      <div className="flex gap-3">
                        <button className="p-3 bg-primary hover:bg-slate-900 text-white transition-all shadow-xl rounded-2xl active:scale-90">
                          <Plus size={18} strokeWidth={3} />
                        </button>
                        <button className="p-3 bg-red-500 hover:bg-slate-900 text-white transition-all shadow-xl rounded-2xl active:scale-90">
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center py-32 bg-slate-50 border border-slate-100 rounded-[3rem] shadow-inner italic">
                <Terminal className="mx-auto mb-6 text-slate-200" size={64} strokeWidth={2.5} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                  No assets found in this folder.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset Detail Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-8 z-[100]"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white border border-slate-100 p-2 max-w-4xl w-full shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden"
            >
              <div className="bg-white p-10">
                <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 text-primary">
                      <Layers size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight italic">
                      Asset <span className="text-primary">Details</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-300 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center shadow-inner"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-slate-50 p-4 rounded-[2.5rem] border border-slate-100 min-h-[350px] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                      <ImageIcon size={200} className="text-primary" />
                    </div>
                    {selectedMedia.type === "font" || selectedMedia.type === "pdf" || selectedMedia.type === "other" ? (
                         <div className="flex flex-col items-center gap-6 text-primary relative z-10">
                            {selectedMedia.type === "font" && <Type size={80} strokeWidth={2.5} />}
                            {selectedMedia.type === "pdf" && <FileText size={80} strokeWidth={2.5} />}
                            {selectedMedia.type === "other" && <FileIcon size={80} strokeWidth={2.5} />}
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20 italic">
                                {selectedMedia.filename.split('.').pop()} RESOURCE
                            </span>
                         </div>
                    ) : (
                      <img
                        src={selectedMedia.url}
                        alt=""
                        className="max-h-[300px] w-auto object-contain relative z-10 drop-shadow-2xl"
                      />
                    )}
                  </div>

                  <div className="space-y-8 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="border-l-4 border-primary/20 pl-6 py-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">
                          Asset Name
                        </p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-widest italic truncate">
                          {selectedMedia.filename}
                        </p>
                      </div>
                      <div className="border-l-4 border-slate-100 pl-6 py-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">
                          Folder Location
                        </p>
                        <p className="text-sm font-black text-slate-600 uppercase tracking-widest italic">
                          {selectedMedia.foldername || "Primary Storage"}
                        </p>
                      </div>
                      <div className="border-l-4 border-slate-100 pl-6 py-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">
                          File Size
                        </p>
                        <p className="text-sm font-black text-slate-600 uppercase tracking-widest italic">
                          {typeof selectedMedia.size === "number"
                            ? `${(selectedMedia.size / 1024).toFixed(0)} KB`
                            : selectedMedia.size}
                        </p>
                      </div>
                    </div>

                    {onSelect ? (
                      <button
                        onClick={() => {
                          onSelect(selectedMedia);
                          setSelectedMedia(null);
                        }}
                        className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.4em] text-[11px] hover:bg-slate-900 transition-all rounded-2xl shadow-xl shadow-primary/20 italic active:scale-95"
                      >
                        Select Asset
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMedia.url);
                          setSelectedMedia(null);
                        }}
                        className="w-full py-5 bg-slate-50 border border-slate-100 text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] hover:text-primary hover:border-primary/30 transition-all rounded-2xl italic active:scale-95 shadow-sm"
                      >
                        Copy Asset Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
    // </div>
  );
};
