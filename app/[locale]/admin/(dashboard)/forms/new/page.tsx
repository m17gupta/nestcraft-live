"use client";

import React from "react";
import { FormBuilder, FormField } from "@/components/admin/forms/FormBuilder";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// import { saveForm } from "@/lib/store/forms/formsThunk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function NewFormPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading: formloading } = useAppSelector(
    (state: RootState) => state.adminForms,
  );

  const handleSave = async (name: string, fields: FormField[]) => {
    // try {
    //   const tId = toast.loading("Saving form...");
    //   await dispatch(saveForm({ payload: { name, fields } })).unwrap();
    //   toast.success("Form created successfully", { id: tId });
    //   setTimeout(() => router.push("/admin/forms"), 1000);
    // } catch (err: any) {
    //   toast.error(err || "Failed to create form");
    // }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex items-center gap-6 bg-white border border-slate-100 p-8 rounded-none shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-14 w-14 rounded-none bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Create <span className="text-primary">Form</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Build a new dynamic data capture form.
          </p>
        </div>
      </div>

      <FormBuilder onSave={handleSave} loading={formloading} />
    </div>
  );
}
