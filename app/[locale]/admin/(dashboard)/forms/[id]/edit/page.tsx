"use client";

import React, { useEffect, useState } from "react";
import { FormBuilder, FormField } from "@/components/admin/forms/FormBuilder";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
;
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const { allForms, isLoading } = useAppSelector((state: RootState) => state.adminForms);
  const [form, setForm] = useState<any>(null);

  // useEffect(() => {
  //   if (allForms.length === 0) {
  //     dispatch(fetchForms());
  //   }
  // }, [allForms.length, dispatch]);

  useEffect(() => {
    if (allForms.length > 0 && id) {
      const found = allForms.find((f: any) => f._id === id);
      if (found) {
        setForm(found);
      } else {
        toast.error("Form not found");
        router.push("/admin/forms");
      }
    }
  }, [allForms, id, router]);

  const handleSave = async (name: string, fields: FormField[]) => {
    // try {
    //   const tId = toast.loading("Saving form...");
    //   await dispatch(saveForm({ id, payload: { name, fields } })).unwrap();
    //   toast.success("Form updated successfully", { id: tId });
    //   setTimeout(() => router.push("/admin/forms"), 1000);
    // } catch (err: any) {
    //   toast.error(err || "Failed to save form");
    // }
  };

  if (!form) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-5">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-sm" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
          Loading Form...
        </span>
      </div>
    );
  }

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
            Edit <span className="text-primary">Form</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Modify existing form fields and configuration.
          </p>
        </div>
      </div>

      <FormBuilder 
        onSave={handleSave} 
        loading={isLoading} 
        initialFields={form.fields} 
        initialName={form.name} 
      />
    </div>
  );
}
