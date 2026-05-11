import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Plus,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  ArrowLeft,
  Save,
  Shield,
  Zap,
  Terminal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomerAddress } from "@/lib/store/users/userSlice";
import { AddressForm } from "./AddressForm";

interface CustomerFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  title: string;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  loading,
  title,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    addresses: [] as CustomerAddress[],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Password is never pre-filled
        phone: initialData.phone || "",
        addresses: initialData.addresses || [],
      });
    }
  }, [initialData]);

  const handleAddAddress = () => {
    const newAddress: CustomerAddress = {
      _id: Math.random().toString(36).substr(2, 9),
      label: "NEW ADDRESS",
      addressLine1: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      isDefault: formData.addresses.length === 0,
    };
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddress],
    }));
  };

  const handleAddressChange = (
    id: string,
    updatedFields: Partial<CustomerAddress>,
  ) => {
    setFormData((prev) => {
      let newAddresses = prev.addresses.map((addr) =>
        addr._id === id ? { ...addr, ...updatedFields } : addr,
      );

      if (updatedFields.isDefault) {
        newAddresses = newAddresses.map((addr) =>
          addr._id === id ? addr : { ...addr, isDefault: false },
        );
      }

      return { ...prev, addresses: newAddresses };
    });
  };

  const handleRemoveAddress = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr._id !== id),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl shadow-slate-200/50 italic">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary/40">
              <Terminal size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                Customer Profile
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {title.split(" ")[0]}{" "}
              <span className="text-primary italic">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-2xl bg-primary text-white h-14 px-12 gap-4 shadow-xl shadow-primary/20 border border-primary/30 hover:bg-slate-900 transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.2em] italic"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} strokeWidth={3} /> Save Customer
            </>
          )}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
      >
        <div className="lg:col-span-3 space-y-8">
          {/* General Information Section */}
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <User size={160} className="text-primary" />
            </div>

            <div className="relative z-10 flex items-center gap-5 mb-10 pb-6 border-b border-slate-50">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Customer <span className="text-primary">Details</span>
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  Full Name
                </Label>
                <div className="relative group-focus-within:text-primary">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  Email Address
                </Label>
                <div className="relative group-focus-within:text-primary">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors">
                    <Mail size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="customer@example.com"
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  Phone Number
                </Label>
                <div className="relative group-focus-within:text-primary">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors">
                    <Phone size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 (555) 000-0000"
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  {initialData
                    ? "Update Password (Optional)"
                    : "Password"}
                </Label>
                <div className="relative group-focus-within:text-primary">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 pointer-events-none group-focus-within:text-primary transition-colors">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                  Saved <span className="text-primary">Addresses</span>
                </h3>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddAddress}
                className="h-12 px-8 rounded-2xl bg-white border border-slate-100 text-primary font-black uppercase tracking-[0.2em] hover:bg-primary/5 transition-all gap-3 shadow-sm active:scale-95 text-[10px] italic"
              >
                <Plus size={18} strokeWidth={3} /> Add Address
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {formData.addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-300 bg-white shadow-sm italic">
                  <MapPin className="h-16 w-16 mb-6 opacity-20" strokeWidth={2.5} />
                  <p className="text-[12px] font-black uppercase tracking-[0.4em]">
                    No addresses found
                  </p>
                </div>
              ) : (
                formData.addresses.map((address) => (
                  <AddressForm
                    key={address._id}
                    address={address}
                    onChange={handleAddressChange}
                    onRemove={handleRemoveAddress}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm space-y-8 sticky top-24">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic pb-6 border-b border-slate-50">
              Customer Summary
            </h4>

            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate italic">
                    {formData.name || "Unknown Customer"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] truncate italic">
                    {formData.email || "No email provided"}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-5 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -rotate-45 translate-x-8 -translate-y-8" />

                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic">
                  <span className="text-slate-500">Saved Addresses</span>
                  <span className="text-primary">
                    {formData.addresses.length}
                  </span>
                </div>

                <div className="flex flex-col space-y-2 pt-5 border-t border-slate-200/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-1">
                    Primary Address
                  </span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] truncate bg-primary/5 px-4 py-3 rounded-xl border border-primary/10 italic text-center shadow-sm">
                    {formData.addresses.find((a) => a.isDefault)?.label ||
                      "None Selected"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl italic shadow-inner">
                <Zap className="text-primary" size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Profile active
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
