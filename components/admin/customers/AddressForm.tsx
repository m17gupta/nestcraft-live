import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash, Home, Briefcase, MapPin, Target, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerAddress } from "@/lib/store/users/userSlice";
import { cn } from "@/lib/utils";

interface AddressFormProps {
  address: CustomerAddress;
  onChange: (id: string, updatedAddress: Partial<CustomerAddress>) => void;
  onRemove: (id: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  onRemove,
}) => {
  return (
    <div className="p-8 rounded-2xl border border-slate-100 bg-white space-y-6 relative group transition-all hover:border-primary/20 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-inner">
            {address.label.toLowerCase() === "home" ? (
              <Home size={20} strokeWidth={2.5} />
            ) : address.label.toLowerCase() === "office" ? (
              <Briefcase size={20} strokeWidth={2.5} />
            ) : (
              <Target size={20} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1">Address Label</span>
            <Input
              value={address.label}
              onChange={(e) => onChange(address._id, { label: e.target.value.toUpperCase() })}
              placeholder="e.g. HOME, OFFICE"
              className="h-10 w-48 bg-slate-50 border-slate-100 rounded-xl text-[11px] font-black tracking-widest uppercase text-slate-900 shadow-inner focus:border-primary/30 italic"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
             <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id={`default-${address._id}`}
                checked={address.isDefault}
                onChange={(e) => onChange(address._id, { isDefault: e.target.checked })}
                className="peer h-5 w-5 opacity-0 absolute cursor-pointer z-10"
              />
              <div className="h-5 w-5 border border-slate-200 rounded-[6px] peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center shadow-sm bg-white">
                {address.isDefault && <ShieldCheck size={12} className="text-white" strokeWidth={4} />}
              </div>
            </div>
            <Label
              htmlFor={`default-${address._id}`}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer italic"
            >
              Default Address
            </Label>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 border border-transparent transition-all"
            onClick={() => onRemove(address._id)}
          >
            <Trash size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
            Address Line 1
          </Label>
          <Input
            value={address.addressLine1}
            onChange={(e) =>
              onChange(address._id, { addressLine1: e.target.value })
            }
            placeholder="Street address, P.O. box"
            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
            Address Line 2
          </Label>
          <Input
            value={address.addressLine2}
            onChange={(e) =>
              onChange(address._id, { addressLine2: e.target.value })
            }
            placeholder="Apt, suite, unit, building, floor, etc."
            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
            Landmark
          </Label>
          <Input
            value={address.landmark}
            onChange={(e) =>
              onChange(address._id, { landmark: e.target.value })
            }
            placeholder="e.g. Near Apollo Hospital"
            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
              City
            </Label>
            <Input
              value={address.city}
              onChange={(e) => onChange(address._id, { city: e.target.value })}
              placeholder="City name"
              className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
              Postal Code
            </Label>
            <Input
              value={address.pincode}
              onChange={(e) =>
                onChange(address._id, { pincode: e.target.value })
              }
              placeholder="ZIP / PIN Code"
              className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
            State / Province
          </Label>
          <Input
            value={address.state}
            onChange={(e) => onChange(address._id, { state: e.target.value })}
            placeholder="State name"
            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block italic">
            Country
          </Label>
          <Input
            value={address.country}
            onChange={(e) => onChange(address._id, { country: e.target.value })}
            placeholder="Country name"
            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wide text-slate-900 shadow-inner focus:border-primary/30"
          />
        </div>
      </div>
    </div>
  );
};
