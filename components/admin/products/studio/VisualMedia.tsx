"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash,
  Star,
  LayoutGrid,
  Maximize2,
} from "lucide-react";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";
import { ProductGalleryItem } from "@/lib/admin-products/utils";

interface VisualMediaProps {
  gallery: ProductGalleryItem[];
  primaryImageId: string;
  galleryUrlDraft: string;
  onGalleryChange: (gallery: ProductGalleryItem[]) => void;
  onPrimaryImageChange: (id: string) => void;
  onGalleryUrlDraftChange: (url: string) => void;
  onAddGalleryItem: (item: ProductGalleryItem) => void;
}

export const VisualMedia: React.FC<VisualMediaProps> = ({
  gallery,
  primaryImageId,
  galleryUrlDraft,
  onGalleryChange,
  onPrimaryImageChange,
  onGalleryUrlDraftChange,
  onAddGalleryItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removeImage = (id: string) => {
    const next = gallery.filter((item) => item.id !== id);
    onGalleryChange(next);
    if (primaryImageId === id) {
      onPrimaryImageChange(next.length > 0 ? next[0].id : "");
    }
  };

  const handleSelectFromLibrary = (media: { url: string; alt: string }) => {
    const newItem: ProductGalleryItem = {
      id: `lib-${Date.now()}`,
      url: media.url,
      alt: media.alt || "",
      order: gallery.length,
    };
    onAddGalleryItem(newItem);
    setIsModalOpen(false);
  };

  return (
    <>
      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectFromLibrary}
      />
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-xl italic">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
              <LayoutGrid size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] italic">
              Media Gallery
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 italic active:scale-95"
          >
            <Plus size={18} strokeWidth={3} /> Browse Media
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              className={`relative aspect-square group bg-slate-50 border-2 transition-all duration-300 rounded-[1.5rem] overflow-hidden shadow-sm ${
                primaryImageId === item.id
                  ? "border-primary shadow-xl shadow-primary/20"
                  : "border-slate-50 hover:border-primary/20"
              }`}
            >
              <img
                src={item.url}
                alt={item.alt}
                className="h-full w-full object-cover transition-all group-hover:scale-110 duration-700"
              />

              {/* Controls */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  onClick={() => onPrimaryImageChange(item.id)}
                  className={`p-3 rounded-xl transition-all shadow-xl active:scale-90 ${primaryImageId === item.id ? "bg-primary text-white" : "bg-white text-slate-400 hover:text-primary"}`}
                  title="Set as Primary"
                >
                  <Star
                    size={16}
                    strokeWidth={2.5}
                    fill={primaryImageId === item.id ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => removeImage(item.id)}
                  className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-xl active:scale-90"
                  title="Delete Asset"
                >
                  <Trash size={16} strokeWidth={2.5} />
                </button>
              </div>

              {primaryImageId === item.id && (
                <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg italic">
                  Primary Image
                </div>
              )}
            </div>
          ))}

          {/* Empty State / Add Placeholder */}
          {gallery.length === 0 && (
            <div
              onClick={() => setIsModalOpen(true)}
              className="aspect-square border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-primary/20 transition-all group rounded-[1.5rem] shadow-inner italic"
            >
              <ImageIcon
                size={40}
                strokeWidth={2.5}
                className="text-slate-200 group-hover:text-primary transition-colors"
              />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-primary">
                Add Images
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
