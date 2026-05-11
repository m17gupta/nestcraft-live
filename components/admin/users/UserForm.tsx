import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  Shield,
  Activity,
  UserPlus,
  Terminal,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface UserFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  title: string;
}

export const UserForm: React.FC<UserFormProps> = ({
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
    role: "staff",
    status: "active",
    isTenantOwner: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "", // Password is never pre-filled
        role: initialData.role || "staff",
        status: initialData.status || "active",
        isTenantOwner: initialData.isTenantOwner || false,
      });
    }
  }, [initialData]);

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
            type="button"
            className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary/40">
              <Terminal size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                User Management Console
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {title.split(' ')[0]} <span className="text-primary italic">{title.split(' ').slice(1).join(' ')}</span>
            </h1>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          type="button"
          className="rounded-2xl bg-primary text-white h-14 px-12 gap-4 shadow-xl shadow-primary/20 border border-primary/30 hover:bg-slate-900 transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.2em] italic"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} strokeWidth={3} /> Save User
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {/* General Information Section */}
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <UserPlus size={160} className="text-primary" />
            </div>

            <div className="relative z-10 flex items-center gap-5 mb-10 pb-6 border-b border-slate-50">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                User <span className="text-primary">Details</span>
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
                    required
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
                    placeholder="user@example.com"
                    required
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  User Role
                </Label>
                <div className="relative group-focus-within:text-primary">
                  <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 z-10 pointer-events-none group-focus-within:text-primary">
                    <Shield size={18} strokeWidth={2.5} />
                  </div>
                  <Select
                    value={formData.role}
                    onValueChange={(val) =>
                      setFormData({ ...formData, role: val })
                    }
                  >
                    <SelectTrigger className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-100 text-slate-900 font-bold uppercase tracking-widest italic rounded-2xl shadow-xl p-2">
                      <SelectItem value="admin" className="py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer">Administrator</SelectItem>
                      <SelectItem value="staff" className="py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer">Staff</SelectItem>
                      <SelectItem value="manager" className="py-3 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 block italic">
                  {initialData ? "Update Password (Optional)" : "Password"}
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
                    required={!initialData}
                    className="pl-14 h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/50 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-widest text-slate-900 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Access Control Section */}
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Zap size={160} className="text-primary" />
            </div>

            <div className="relative z-10 flex items-center gap-5 mb-10 pb-6 border-b border-slate-50">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Advanced <span className="text-primary">Permissions</span>
              </h3>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-inner gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-black text-slate-900 uppercase tracking-tight italic">
                    Account Status
                  </Label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
                    Active users can access the system.
                  </p>
                </div>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-[140px] h-12 bg-white border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary italic shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-100 text-slate-900 font-bold uppercase tracking-widest italic px-2 rounded-xl shadow-xl">
                    <SelectItem value="active" className="rounded-lg focus:bg-primary/5 focus:text-primary">Active</SelectItem>
                    <SelectItem value="inactive" className="rounded-lg focus:bg-primary/5 focus:text-primary">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-inner gap-4">
                <div className="space-y-2">
                  <Label className="text-[13px] font-black text-slate-900 uppercase tracking-tight italic">
                    Tenant Owner
                  </Label>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
                    Grant root authority for the tenant.
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={formData.isTenantOwner}
                    onChange={(e) => setFormData({ ...formData, isTenantOwner: e.target.checked })}
                    className="peer h-6 w-12 opacity-0 absolute cursor-pointer z-10"
                  />
                  <div className="h-8 w-14 bg-slate-200 border border-slate-300 rounded-full transition-all peer-checked:bg-primary/20 peer-checked:border-primary/50 flex items-center px-1">
                    <div className={cn("h-6 w-6 bg-white rounded-full transition-all translate-x-0 peer-checked:translate-x-6 peer-checked:bg-primary shadow-sm")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary Section */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm space-y-8 sticky top-24">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 italic pb-6 border-b border-slate-50">
              User Summary
            </h4>
            
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex flex-col space-y-1 overflow-hidden">
                  <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate italic">
                    {formData.name || "Unknown User"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] truncate italic">
                    {formData.role.toUpperCase() || "PENDING ROLE"}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-5 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -rotate-45 translate-x-8 -translate-y-8" />
                
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic">
                  <span className="text-slate-500">Account State</span>
                  <span className={cn(formData.status === 'active' ? 'text-emerald-500' : 'text-red-500')}>{formData.status.toUpperCase()}</span>
                </div>
                
                <div className="flex flex-col space-y-2 pt-5 border-t border-slate-200/50">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic mb-1">Access Level</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] truncate bg-primary/5 px-4 py-3 rounded-xl border border-primary/10 italic text-center shadow-sm">
                    {formData.isTenantOwner ? "Tenant Root Access" : "Standard User"}
                  </span>
                </div>
              </div>

               <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl italic shadow-inner">
                <Shield className="text-primary" size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Authentication required
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
