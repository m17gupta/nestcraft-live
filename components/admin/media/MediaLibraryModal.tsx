"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MediaUploader } from "./MediaManage";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Layers } from "lucide-react";

interface MediaLibraryModalProps {
  onSelect: (media: { url: string; alt: string }) => void;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const MediaLibraryModal = ({
  onSelect,
  trigger,
  isOpen: externalOpen,
  onClose: externalClose,
}: MediaLibraryModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled) {
      if (!val && externalClose) externalClose();
    } else {
      setInternalOpen(val);
    }
  };

  const handleSelect = (media: any) => {
    onSelect({
      url: media.url,
      alt: media.alt || "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="!max-w-6xl overflow-y-auto !h-[85vh] bg-white border-slate-100 rounded-[2.5rem] p-0 shadow-2xl overflow-hidden italic">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-10 border-b border-slate-50 bg-white">
              <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                  <Layers size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                    Media <span className="text-primary">Library</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] pt-1.5 italic">
                    Select or upload your digital assets.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
               <MediaUploader onSelect={handleSelect} hideHeader={true} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};
