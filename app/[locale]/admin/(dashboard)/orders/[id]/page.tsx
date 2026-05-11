"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CreditCard,
  Download,
  Edit,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldCheck,
  Terminal,
  Truck,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { id: "pending", label: "Pending", color: "amber-500", icon: Clock },
  { id: "processing", label: "Processing", color: "blue-500", icon: Zap },
  { id: "shipped", label: "Shipped", color: "purple-500", icon: Truck },
  {
    id: "delivered",
    label: "Delivered",
    color: "emerald-500",
    icon: CheckCircle2,
  },
  { id: "cancelled", label: "Cancelled", color: "red-500", icon: AlertCircle },
];

function OrderDetailPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await fetch(`/api/ecommerce/orders/${id}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
        setNotes(data.notes || "");
      } catch (err) {
        toast.error("Failed to load order details.");
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id, router]);

  const handleUpdate = async () => {
    setUpdating(true);
    const tId = toast.loading("Updating order status...");
    try {
      const res = await fetch(`/api/ecommerce/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order status updated successfully", { id: tId });
    } catch (err) {
      toast.error("Failed to update order status", { id: tId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-5">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-sm" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
          Loading Order Details...
        </span>
      </div>
    );
  }

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.id === status) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-none border border-slate-100 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.push("/admin/orders")}
              className="h-12 w-12 rounded-none bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all shadow-sm active:scale-95 flex items-center justify-center"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              Order <span className="text-primary">{order.orderNumber}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 ml-17">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <Terminal size={14} className="text-primary/60" strokeWidth={2.5} />
              Order Status:
            </div>
            <div
              className={cn(
                "px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border bg-white shadow-sm",
                `border-${currentStatus.color}/20 text-${currentStatus.color}`,
              )}
            >
              {currentStatus.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="h-14 px-8 bg-white border border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-3 shadow-sm rounded-none">
            <Download size={18} strokeWidth={2.5} /> Download Invoice
          </button>
          <button
            disabled={updating}
            onClick={handleUpdate}
            className="h-14 px-10 bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-primary/20 rounded-none"
          >
            {updating ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-none animate-spin" />
            ) : (
              <Save size={18} strokeWidth={2.5} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order Details & Items */}
        <div className="lg:col-span-8 space-y-8">
          {/* Mission Items */}
          <div className="bg-white border border-slate-100 p-8 rounded-none space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-l-4 border-primary pl-4">
              <Package size={22} className="text-primary" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Order <span className="text-primary">Items</span>
              </h3>
            </div>

            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-none group hover:border-primary/20 transition-all shadow-inner"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-white border border-slate-200 rounded-xl overflow-hidden relative shadow-sm">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black px-2 py-1 rounded-bl-xl shadow-sm">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Variant: {item.variantTitle || "Default"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-black text-slate-900 tracking-wider">
                      ${item.price * item.quantity}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      ${item.price} each
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-50 space-y-3">
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest px-4">
                <span>Subtotal</span>
                <span className="text-slate-900">${order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest px-4">
                <span>Shipping</span>
                <span className="text-slate-900">${order.shippingCost || 0}</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 uppercase tracking-tighter bg-primary/5 p-6 border border-primary/10 rounded-none shadow-inner mt-4">
                <span className="flex items-center gap-3">
                  <ShieldCheck className="text-primary" strokeWidth={2.5} /> Total Amount
                </span>
                <span className="text-primary">${order.total}</span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white border border-slate-100 p-8 rounded-none space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-l-4 border-primary pl-4">
              <Terminal size={22} className="text-primary" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Admin <span className="text-primary">Notes</span>
              </h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 bg-slate-50 border border-slate-100 rounded-none p-5 text-[12px] font-bold text-slate-900 tracking-wide focus:border-primary/50 focus:bg-white outline-none resize-none placeholder:text-slate-400 shadow-inner"
              placeholder="Enter internal admin notes here..."
            />
          </div>
        </div>

        {/* Sidebar: Status & Customer */}
        <div className="lg:col-span-4 space-y-8">
          {/* Status Control */}
          <div className="bg-white border border-slate-100 p-8 rounded-none space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-l-4 border-primary pl-4">
              <Edit size={22} className="text-primary" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Update <span className="text-primary">Status</span>
              </h3>
            </div>
            <div className="space-y-3">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStatus(opt.id)}
                  className={cn(
                    "w-full p-4 border rounded-xl flex items-center justify-between transition-all group shadow-sm",
                    status === opt.id
                      ? `bg-white border-${opt.color}/30 text-slate-900 shadow-md ring-1 ring-${opt.color}/10`
                      : "bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:bg-white",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon
                      size={18}
                      strokeWidth={2.5}
                      className={
                        status === opt.id ? `text-${opt.color}` : "text-slate-400"
                      }
                    />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      {opt.label}
                    </span>
                  </div>
                  {status === opt.id && (
                    <CheckCircle2 size={16} className={`text-${opt.color}`} strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Personnel Intel */}
          <div className="bg-white border border-slate-100 p-8 rounded-none space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-slate-50 transform rotate-12 scale-150">
              <User size={160} />
            </div>
            <div className="flex items-center gap-4 border-l-4 border-primary pl-4 relative z-10">
              <User size={22} className="text-primary" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Customer <span className="text-primary">Details</span>
              </h3>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block ml-1">
                  Customer Name
                </span>
                <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">
                  <Globe size={16} className="text-primary" strokeWidth={2.5} />{" "}
                  {order.customer?.name}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block ml-1">
                  Email Address
                </span>
                <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner">
                  <Mail size={16} className="text-primary" strokeWidth={2.5} />{" "}
                  {order.customer?.email}
                </span>
                {order.customer?.phone && (
                  <span className="text-[11px] font-bold text-slate-500 block mt-2 ml-1 flex items-center gap-2">
                    <Phone size={14} strokeWidth={2.5} /> {order.customer.phone}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] block ml-1">
                  Shipping Address
                </span>
                <div className="flex items-start gap-3 bg-slate-50 p-4 border border-slate-100 rounded-xl shadow-inner">
                  <MapPin size={18} className="text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                      {order.shippingAddress?.fullName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed">
                      {order.shippingAddress?.addressLine1}
                      {order.shippingAddress?.addressLine2 &&
                        `, ${order.shippingAddress.addressLine2}`}
                      <br />
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.zipCode}
                      <br />
                      {order.shippingAddress?.country}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Intel */}
          <div className="bg-white border border-slate-100 p-8 rounded-none space-y-6 shadow-sm">
            <div className="flex items-center gap-4 border-l-4 border-primary pl-4">
              <CreditCard size={22} className="text-primary" strokeWidth={2.5} />
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                Payment <span className="text-primary">Method</span>
              </h3>
            </div>
            <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-none shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse shadow-sm" />
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                  {order.paymentMethod || "Standard Payment"}
                </span>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-5">
            <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-sm" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Loading Order...
            </span>
          </div>
        }
      >
        <OrderDetailPageContent />
      </Suspense>
    </div>
  );
}
