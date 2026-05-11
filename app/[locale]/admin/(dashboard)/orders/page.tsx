"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  AlertCircle,
  Database,
  Terminal,
  Zap,
  Plus,
  X,
  Save,
  Edit2,
  Trash2,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Tag,
  FileText,
  CheckCircle2,
  XCircle,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

// Status Configuration
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: { label: "Pending", color: "amber-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "blue-500", icon: CheckCircle2 },
  processing: { label: "Processing", color: "blue-500", icon: Zap },
  shipped: { label: "Shipped", color: "purple-500", icon: Truck },
  delivered: {
    label: "Delivered",
    color: "emerald-500",
    icon: CheckCircle2,
  },
  cancelled: { label: "Cancelled", color: "red-500", icon: AlertCircle },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> =
  {
    pending: { label: "Pending", color: "amber-500" },
    paid: { label: "Paid", color: "emerald-500" },
    failed: { label: "Failed", color: "red-500" },
  };

const FULFILLMENT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  unfulfilled: { label: "Unfulfilled", color: "amber-500" },
  fulfilled: { label: "Fulfilled", color: "emerald-500" },
};

// Types
interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  price: number;
  compareAtPrice?: number;
  variantId?: string | null;
  variantTitle?: string | null;
  selectedOptions?: Record<string, string>;
  image?: string;
  customization?: Record<string, any>;
}

interface Address {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId?: string | null;
  sessionId: string;
  email: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  shippingAddress: Address;
  billingAddress: Address;
  payment: {
    method: string;
    transactionId?: string | null;
    paymentGatewayResponse?: any;
    paidAt?: string | null;
  };
  shipping: {
    method: string;
    carrier?: string | null;
    trackingNumber?: string | null;
    shippedAt?: string | null;
    deliveredAt?: string | null;
  };
  coupon: {
    code?: string | null;
    discountAmount: number;
  };
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Sample data - replace with API calls
const initialOrders: Order[] = [
  {
    _id: "70a100000000000000000001",
    orderNumber: "ORD-20260408-0001",
    userId: null,
    sessionId: "0c707bc5-09e1-4b7b-b9b7-0baec184d502",
    email: "himanshu@example.com",
    status: "pending",
    paymentStatus: "pending",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productId: "69d5f9f729a1675d862e07a2",
        name: "Authentic Military Dog Tags – Ship Free!",
        slug: "authentic-military-dog-tags-ship-free",
        sku: "1003",
        quantity: 1,
        price: 9.3,
        compareAtPrice: 20,
        variantId: null,
        variantTitle: null,
        selectedOptions: {},
        image: "/uploads/products-31sh8jvc9cl.webp",
        customization: {
          firstname: "Himanshu",
          lastname: "Kumawat",
          service_number: "123321",
          blood_group: "O+",
          religious_preference: "Hindu",
        },
      },
    ],
    pricing: {
      subtotal: 9.3,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 9.3,
    },
    shippingAddress: {
      firstName: "Himanshu",
      lastName: "Kumawat",
      phone: "9876543210",
      address1: "House No. 123, Street Name",
      address2: "Near City Park",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India",
    },
    billingAddress: {
      firstName: "Himanshu",
      lastName: "Kumawat",
      phone: "9876543210",
      address1: "House No. 123, Street Name",
      address2: "Near City Park",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India",
    },
    payment: {
      method: "cod",
      transactionId: null,
      paymentGatewayResponse: null,
      paidAt: null,
    },
    shipping: {
      method: "standard",
      carrier: null,
      trackingNumber: null,
      shippedAt: null,
      deliveredAt: null,
    },
    coupon: {
      code: null,
      discountAmount: 0,
    },
    createdAt: "2026-04-08T10:10:00.000Z",
    updatedAt: "2026-04-08T10:10:00.000Z",
  },
  {
    _id: "70a100000000000000000002",
    orderNumber: "ORD-20260408-0002",
    userId: "70a0ff000000000000000111",
    sessionId: "b71c9ad1-8c32-4e12-ae4c-112233445566",
    email: "deepak.rai@example.com",
    status: "confirmed",
    paymentStatus: "paid",
    fulfillmentStatus: "unfulfilled",
    items: [
      {
        productId: "69d4a18a11eb8d8eac89c40a",
        name: '5.11 Double Duty TDU Belt – 1.5" Wide 59568',
        slug: "5-11-double-duty-tdu-belt-1-5-wide-59568",
        sku: "59568-L-BLK-COY",
        quantity: 2,
        price: 2799,
        compareAtPrice: 3399,
        variantId: "69d4a18b11eb8d8eac89c40d",
        variantTitle: "Large / Black-Coyote",
        selectedOptions: {
          size: "Large",
          color: "Black/Coyote",
        },
        image:
          "https://alliedsurplus.com/wp-content/uploads/2015/02/products-59568_190_alternate1-600x600.jpg",
      },
    ],
    pricing: {
      subtotal: 5598,
      tax: 0,
      shipping: 100,
      discount: 200,
      total: 5498,
    },
    shippingAddress: {
      firstName: "Deepak",
      lastName: "Rai",
      phone: "9123456789",
      address1: "Plot 45, Sector 10",
      address2: "Near Metro Station",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    billingAddress: {
      firstName: "Deepak",
      lastName: "Rai",
      phone: "9123456789",
      address1: "Plot 45, Sector 10",
      address2: "Near Metro Station",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    payment: {
      method: "razorpay",
      transactionId: "pay_ABC123XYZ",
      paymentGatewayResponse: {
        status: "captured",
        amount: 549800,
        currency: "INR",
      },
      paidAt: "2026-04-08T10:20:00.000Z",
    },
    shipping: {
      method: "express",
      carrier: "Delhivery",
      trackingNumber: "DLV123456789",
      shippedAt: null,
      deliveredAt: null,
    },
    coupon: {
      code: "WELCOME200",
      discountAmount: 200,
    },
    createdAt: "2026-04-08T10:18:00.000Z",
    updatedAt: "2026-04-08T10:20:00.000Z",
  },
];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "create" | "edit" | "view">("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ecommerce/orders");
        const data = await res.json();
        if (data.success) {
          const prevOrders = structuredClone(orders);
          setOrders([...prevOrders, ...data.data]);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(
    (ord) =>
      ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress?.firstName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      ord.shippingAddress?.lastName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Handle view order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setView("view");
  };

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setView("edit");
  };

  // Handle delete order
  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((o) => o._id !== orderId));
    }
  };

  // Handle create new order
  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setView("create");
  };

  // Handle save order (create or update)
  const handleSaveOrder = (order: Order) => {
    if (order._id) {
      // Update existing
      setOrders(orders.map((o) => (o._id === order._id ? order : o)));
    } else {
      // Create new
      const newOrder = {
        ...order,
        _id: `70a10000000000000000${String(orders.length + 1).padStart(4, "0")}`,
        orderNumber: `ORD-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${String(orders.length + 1).padStart(4, "0")}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setOrders([...orders, newOrder]);
    }
    setView("list");
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
              Order <span className="text-primary">Management</span>
            </h1>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Database size={14} className="text-primary" /> Real-time tracking of platform orders and customer fulfillment.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {view === "list" && (
              <>
                <button
                  onClick={handleCreateOrder}
                  className="h-14 px-8 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-4 shadow-xl shadow-primary/20 rounded-none"
                >
                  <Plus size={20} strokeWidth={3} /> Create Order
                </button>
                <button className="h-14 px-8 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center gap-4 rounded-none shadow-sm">
                  <Download size={18} /> Export List
                </button>
              </>
            )}
            {view !== "list" && (
              <button
                onClick={() => setView("list")}
                className="h-14 px-8 bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/20 transition-all flex items-center gap-4 rounded-none shadow-sm"
              >
                <X size={18} strokeWidth={3} /> Close
              </button>
            )}
          </div>
        </div>

        {/* Views */}
        {view === "list" && (
          <>
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-8 items-center justify-between bg-white p-6 rounded-none border border-slate-100 shadow-sm">
              <div className="relative w-full sm:w-[450px] group">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors"
                  size={18}
                  strokeWidth={2.5}
                />
                <input
                  placeholder="SEARCH ORDERS BY NUMBER OR CUSTOMER..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-none text-[13px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-200 focus:border-primary/50 outline-none transition-all shadow-inner"
                />
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Filter size={16} className="text-primary/40" /> Filter Active
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest">
                  <Zap size={16} strokeWidth={2.5} /> {filteredOrders.length}{" "}
                  Orders Found
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-sm relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Package size={200} className="text-primary" />
              </div>
              
              <div className="overflow-x-auto relative z-10">
                <table className="w-full">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="h-20">
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-10">
                        Order Details
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Customer
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Status
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Payment
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Amount
                      </th>
                      <th className="text-left text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        Date
                      </th>
                      <th className="text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-10">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr className="border-none">
                        <td colSpan={7} className="h-80 text-center">
                          <div className="flex flex-col items-center gap-6">
                            <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-lg shadow-primary/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">
                              Syncing Orders...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr className="border-none">
                        <td colSpan={7} className="h-64 text-center">
                          <div className="flex flex-col items-center gap-6 opacity-10">
                            <AlertCircle size={48} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                              No Operational Logs Detected
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const status =
                          STATUS_CONFIG[ord.status] || STATUS_CONFIG["pending"];
                        const paymentStatus =
                          PAYMENT_STATUS_CONFIG[ord.paymentStatus] ||
                          PAYMENT_STATUS_CONFIG["pending"];

                        return (
                          <tr
                            key={ord._id}
                            className="border-t border-slate-100 hover:bg-slate-50 transition-all duration-500 group"
                          >
                            <td className="px-10 py-8">
                              <div className="flex flex-col space-y-1">
                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                                  {ord.orderNumber}
                                </span>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  REF: #{ord._id.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex flex-col space-y-1">
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                                  {ord.shippingAddress?.firstName}{" "}
                                  {ord.shippingAddress?.lastName}
                                </span>
                                <span className="text-[9px] font-black text-slate-300 lowercase tracking-widest group-hover:text-primary/60 transition-colors">
                                  {ord.email}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center gap-3">
                                <span
                                  className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 border rounded-none shadow-sm flex items-center gap-2",
                                    `border-${status.color}/20 bg-${status.color}/5 text-${status.color}`,
                                  )}
                                >
                                  <status.icon size={12} />
                                  {status.label}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className={cn(
                                  "text-[9px] font-black uppercase tracking-widest px-4 py-1.5 border rounded-none",
                                  `border-${paymentStatus.color}/20 bg-${paymentStatus.color}/5 text-${paymentStatus.color}`,
                                )}
                              >
                                {paymentStatus.label}
                              </span>
                            </td>
                            <td>
                              <span className="text-sm font-black text-slate-900 tracking-tight">
                                ₹{ord.pricing.total.toLocaleString()}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-2.5 text-slate-400">
                                <Clock size={14} className="text-primary/40" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                  {new Date(ord.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="text-right px-10">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                <button
                                  onClick={() => handleViewOrder(ord)}
                                  className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => handleEditOrder(ord)}
                                  className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-blue-500 hover:border-blue-500/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                                  title="Edit Order"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord._id)}
                                  className="h-10 w-10 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500/30 transition-all rounded-xl shadow-sm flex items-center justify-center"
                                  title="Delete Order"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Status */}
            <div className="flex items-center gap-5 p-8 bg-white border border-slate-100 rounded-none shadow-sm">
              <Terminal size={18} className="text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                System Status: Online | Processing Orders Securely
              </span>
            </div>
          </>
        )}

        {view === "view" && selectedOrder && (
          <OrderViewComponent
            order={selectedOrder}
            onClose={() => setView("list")}
            onEdit={() => setView("edit")}
          />
        )}

        {(view === "create" || view === "edit") && (
          <OrderFormComponent
            order={selectedOrder}
            onSave={handleSaveOrder}
            onCancel={() => setView("list")}
            isEdit={view === "edit"}
          />
        )}
      </div>
    </div>
  );
}

// Order View Component
function OrderViewComponent({
  order,
  onClose,
  onEdit,
}: {
  order: Order;
  onClose: () => void;
  onEdit: () => void;
}) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["pending"];
  const paymentStatus = PAYMENT_STATUS_CONFIG[order.paymentStatus];
  const fulfillmentStatus = FULFILLMENT_STATUS_CONFIG[order.fulfillmentStatus];

  return (
    <div className="space-y-10">
      {/* Order Summary Card */}
      <div className="bg-white border border-slate-100 p-10 rounded-none shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-none -translate-y-32 translate-x-32" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-none flex items-center justify-center text-primary shadow-inner">
                <Package size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">
                {order.orderNumber}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-5 py-2 border rounded-none flex items-center gap-2 shadow-sm",
                  `border-${status.color}/20 bg-${status.color}/5 text-${status.color}`,
                )}
              >
                <status.icon size={14} />
                {status.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-5 py-2 border rounded-none shadow-sm",
                  `border-${paymentStatus.color}/20 bg-${paymentStatus.color}/5 text-${paymentStatus.color}`,
                )}
              >
                {paymentStatus.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-5 py-2 border rounded-none shadow-sm",
                  `border-${fulfillmentStatus.color}/20 bg-${fulfillmentStatus.color}/5 text-${fulfillmentStatus.color}`,
                )}
              >
                {fulfillmentStatus.label}
              </span>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-4 shadow-xl shadow-primary/20 rounded-none"
          >
            <Edit2 size={18} strokeWidth={3} /> Edit Order
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 mt-10 border-t border-slate-100 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <Clock size={16} className="text-primary/40" /> Order Placed
            </div>
            <div className="text-slate-900 font-black">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <User size={16} className="text-primary/40" /> Customer Email
            </div>
            <div className="text-slate-900 font-black">{order.email}</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <CreditCard size={16} className="text-primary/40" /> Total Amount
            </div>
            <div className="text-primary font-black text-3xl">
              ₹{order.pricing.total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items List */}
      <div className="bg-white border border-slate-100 p-10 rounded-none shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-4">
          <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
            <Package size={20} />
          </div>
          Order Line Items
        </h3>
        <div className="space-y-6">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-8 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-all group"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover border border-slate-200 rounded-none shadow-sm group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-24 h-24 bg-white border border-slate-100 rounded-none flex items-center justify-center text-slate-200">
                  <Package size={32} />
                </div>
              )}
              <div className="flex-1 space-y-2.5 py-1">
                <div className="font-black text-slate-900 uppercase text-base group-hover:text-primary transition-colors">
                  {item.name}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-white px-3 py-1 rounded-none border border-slate-100">
                    SKU: {item.sku}
                  </span>
                  {item.variantTitle && (
                    <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-none border border-primary/10">
                      Variant: {item.variantTitle}
                    </span>
                  )}
                </div>
                {item.customization &&
                  Object.keys(item.customization).length > 0 && (
                    <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customization Parameters:</div>
                      {Object.entries(item.customization).map(([k, v]) => (
                        <div key={k} className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                          <span className="text-primary">•</span> {k}: {v}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="text-right space-y-2 py-1">
                <div className="text-slate-400 font-black text-sm">
                  ₹{item.price.toLocaleString()} × {item.quantity}
                </div>
                <div className="text-primary font-black text-2xl">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary Grid */}
        <div className="mt-10 pt-10 border-t border-slate-100 space-y-4 max-w-md ml-auto">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Subtotal
            </span>
            <span className="font-black">₹{order.pricing.subtotal.toLocaleString()}</span>
          </div>
          {order.pricing.discount > 0 && (
            <div className="flex justify-between items-center text-emerald-500">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Platform Discount
              </span>
              <span className="font-black">-₹{order.pricing.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Logistics/Shipping
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Tax Calculation
            </span>
            <span className="font-black">₹{order.pricing.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-primary font-black text-3xl pt-6 border-t border-slate-100">
            <span className="text-sm uppercase tracking-[0.3em]">Grand Total</span>
            <span>₹{order.pricing.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Logistics & Address Info */}
        <div className="bg-white border border-slate-100 p-10 rounded-none shadow-sm">
          <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            Shipping Logistics
          </h3>
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-none space-y-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient Details</div>
              <div className="text-slate-900 font-black text-lg leading-none">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </div>
              <div className="text-slate-600 font-bold uppercase tracking-tight text-sm leading-relaxed">
                {order.shippingAddress.address1}
                {order.shippingAddress.address2 && <>, {order.shippingAddress.address2}</>}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                <br />
                {order.shippingAddress.country}
              </div>
              <div className="pt-3 flex items-center gap-3 text-slate-900 font-black text-sm">
                <span className="text-primary text-[10px]">TEL:</span> {order.shippingAddress.phone}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-100 rounded-none space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Parameters</div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Method</div>
                  <div className="text-slate-900 font-black uppercase">{order.shipping.method}</div>
                </div>
                {order.shipping.carrier && (
                  <div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Carrier</div>
                    <div className="text-slate-900 font-black uppercase">{order.shipping.carrier}</div>
                  </div>
                )}
                {order.shipping.trackingNumber && (
                  <div className="col-span-2">
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Tracking ID</div>
                    <div className="text-primary font-black uppercase tracking-wider font-mono">{order.shipping.trackingNumber}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Transaction Info */}
        <div className="bg-white border border-slate-100 p-10 rounded-none shadow-sm">
          <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
              <CreditCard size={20} />
            </div>
            Financial Record
          </h3>
          <div className="space-y-6">
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-none space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <CreditCard size={120} />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</div>
                <div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Payment Method</div>
                  <div className="text-slate-900 font-black uppercase text-xl">{order.payment.method}</div>
                </div>
                
                {order.payment.transactionId && (
                  <div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Transaction Identification</div>
                    <div className="text-primary font-black uppercase tracking-widest font-mono break-all">{order.payment.transactionId}</div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-200 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Verification</div>
                    <div className="text-slate-500 font-bold uppercase text-[10px]">Payment method verified</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary/5 border border-primary/10 rounded-none relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                <Tag size={100} className="text-primary" />
              </div>
              <div className="relative z-10">
                <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-4">Pricing Metadata</div>
                <div className="flex items-end justify-between">
                  <div className="text-primary font-black text-4xl leading-none">
                    ₹{order.pricing.total.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-black text-primary/40 uppercase tracking-widest">
                    Tax Inclusive
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Form Component (Create/Edit)
// function OrderFormComponent({
//   order,
//   onSave,
//   onCancel,
//   isEdit,
// }: {
//   order: Order | null;
//   onSave: (order: Order) => void;
//   onCancel: () => void;
//   isEdit: boolean;
// }) {
//   const [formData, setFormData] = useState<Partial<Order>>(
//     order || {
//       email: "",
//       status: "pending",
//       paymentStatus: "pending",
//       fulfillmentStatus: "unfulfilled",
//       items: [],
//       pricing: {
//         subtotal: 0,
//         tax: 0,
//         shipping: 0,
//         discount: 0,
//         total: 0,
//       },
//       shippingAddress: {
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         country: "India",
//       },
//       billingAddress: {
//         firstName: "",
//         lastName: "",
//         phone: "",
//         address1: "",
//         address2: "",
//         city: "",
//         state: "",
//         pincode: "",
//         country: "India",
//       },
//       payment: {
//         method: "cod",
//       },
//       shipping: {
//         method: "standard",
//       },
//       coupon: {
//         discountAmount: 0,
//       },
//       sessionId: "",
//     },
//   );

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData as Order);
//   };

//   const updateField = (field: string, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const updateNestedField = (parent: string, field: string, value: any) => {
//     setFormData((prev) => ({
//       ...prev,
//       [parent]: {
//         ...(prev[parent as keyof typeof prev] as any),
//         [field]: value,
//       },
//     }));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
//       {/* Form Header */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
//           {isEdit ? "Edit Order" : "Create New Order"}
//         </h2>
//         <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
//           {isEdit
//             ? `Modifying ${formData.orderNumber}`
//             : "Create new order"}
//         </p>
//       </div>

//       {/* Basic Info */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <FileText size={18} className="text-amber-500" /> Basic Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Email *
//             </label>
//             <input
//               type="email"
//               required
//               value={formData.email}
//               onChange={(e) => updateField("email", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               placeholder="customer@example.com"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Session ID
//             </label>
//             <input
//               type="text"
//               value={formData.sessionId}
//               onChange={(e) => updateField("sessionId", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               placeholder="Auto-generated"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Order Status *
//             </label>
//             <select
//               required
//               value={formData.status}
//               onChange={(e) => updateField("status", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="pending">Pending</option>
//               <option value="confirmed">Confirmed</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Payment Status *
//             </label>
//             <select
//               required
//               value={formData.paymentStatus}
//               onChange={(e) => updateField("paymentStatus", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="pending">Pending</option>
//               <option value="paid">Paid</option>
//               <option value="failed">Failed</option>
//             </select>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Fulfillment Status *
//             </label>
//             <select
//               required
//               value={formData.fulfillmentStatus}
//               onChange={(e) => updateField("fulfillmentStatus", e.target.value)}
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//             >
//               <option value="unfulfilled">Unfulfilled</option>
//               <option value="fulfilled">Fulfilled</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <MapPin size={18} className="text-amber-500" /> Shipping Address
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               First Name *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.firstName}
//               onChange={(e) =>
//                 updateNestedField(
//                   "shippingAddress",
//                   "firstName",
//                   e.target.value,
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Last Name *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.lastName}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "lastName", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Phone *
//             </label>
//             <input
//               type="tel"
//               required
//               value={formData.shippingAddress?.phone}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "phone", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Pincode *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.pincode}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "pincode", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Address Line 1 *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.address1}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "address1", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Address Line 2
//             </label>
//             <input
//               type="text"
//               value={formData.shippingAddress?.address2}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "address2", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               City *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.city}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "city", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               State *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.state}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "state", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Country *
//             </label>
//             <input
//               type="text"
//               required
//               value={formData.shippingAddress?.country}
//               onChange={(e) =>
//                 updateNestedField("shippingAddress", "country", e.target.value)
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Payment & Shipping */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-zinc-900 border border-white/5 p-8">
//           <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//             <CreditCard size={18} className="text-amber-500" /> Payment
//           </h3>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Method *
//               </label>
//               <select
//                 required
//                 value={formData.payment?.method}
//                 onChange={(e) =>
//                   updateNestedField("payment", "method", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//               >
//                 <option value="cod">Cash on Delivery</option>
//                 <option value="razorpay">Razorpay</option>
//                 <option value="stripe">Stripe</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Transaction ID
//               </label>
//               <input
//                 type="text"
//                 value={formData.payment?.transactionId || ""}
//                 onChange={(e) =>
//                   updateNestedField("payment", "transactionId", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="bg-zinc-900 border border-white/5 p-8">
//           <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//             <Truck size={18} className="text-amber-500" /> Shipping
//           </h3>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Method *
//               </label>
//               <select
//                 required
//                 value={formData.shipping?.method}
//                 onChange={(e) =>
//                   updateNestedField("shipping", "method", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white focus:border-amber-500 outline-none"
//               >
//                 <option value="standard">Standard</option>
//                 <option value="express">Express</option>
//               </select>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Carrier
//               </label>
//               <input
//                 type="text"
//                 value={formData.shipping?.carrier || ""}
//                 onChange={(e) =>
//                   updateNestedField("shipping", "carrier", e.target.value)
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//                 placeholder="e.g., Delhivery"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//                 Tracking Number
//               </label>
//               <input
//                 type="text"
//                 value={formData.shipping?.trackingNumber || ""}
//                 onChange={(e) =>
//                   updateNestedField(
//                     "shipping",
//                     "trackingNumber",
//                     e.target.value,
//                   )
//                 }
//                 className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pricing */}
//       <div className="bg-zinc-900 border border-white/5 p-8">
//         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
//           <Tag size={18} className="text-amber-500" /> Pricing
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Subtotal *
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               required
//               value={formData.pricing?.subtotal}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "subtotal",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Tax
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.tax}
//               onChange={(e) =>
//                 updateNestedField("pricing", "tax", parseFloat(e.target.value))
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Shipping
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.shipping}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "shipping",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
//               Discount
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               value={formData.pricing?.discount}
//               onChange={(e) =>
//                 updateNestedField(
//                   "pricing",
//                   "discount",
//                   parseFloat(e.target.value),
//                 )
//               }
//               className="w-full h-11 px-4 bg-black border border-white/10 rounded-sm text-sm text-white placeholder:text-white/20 focus:border-amber-500 outline-none"
//             />
//           </div>
//         </div>
//         <div className="mt-6 pt-6 border-t border-white/5">
//           <div className="flex items-center justify-between">
//             <span className="text-[12px] font-black uppercase tracking-widest text-white/40">
//               Total Amount
//             </span>
//             <span className="text-2xl font-black text-amber-500">
//               ₹
//               {(
//                 (formData.pricing?.subtotal || 0) +
//                 (formData.pricing?.tax || 0) +
//                 (formData.pricing?.shipping || 0) -
//                 (formData.pricing?.discount || 0)
//               ).toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-4 justify-end">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="h-12 px-8 bg-zinc-900 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-3"
//         >
//           <X size={16} /> Cancel
//         </button>
//         <button
//           type="submit"
//           className="h-12 px-8 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center gap-3"
//         >
//           <Save size={16} /> {isEdit ? "Update Order" : "Create Order"}
//         </button>
//       </div>
//     </form>
//   );
// }

function OrderFormComponent({
  order,
  onSave,
  onCancel,
  isEdit,
}: {
  order: Order | null;
  onSave: (order: Order) => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const { allProducts } = useSelector(
    (state: RootState) => state.adminProducts,
  );

  const [formData, setFormData] = useState<Partial<Order>>(
    order || {
      email: "",
      status: "pending",
      paymentStatus: "pending",
      fulfillmentStatus: "unfulfilled",
      items: [],
      pricing: {
        subtotal: 0,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0,
      },
      shippingAddress: {
        firstName: "",
        lastName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      billingAddress: {
        firstName: "",
        lastName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      payment: {
        method: "cod",
      },
      shipping: {
        method: "standard",
      },
      coupon: {
        discountAmount: 0,
      },
      sessionId: "",
    },
  );

  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [itemQty, setItemQty] = useState(1);

  const selectedProduct = allProducts?.find(
    (p: any) => p._id === selectedProductId,
  );

  const selectedVariant = selectedProduct?.variants?.find(
    (v: any) => v._id === selectedVariantId,
  );

  const getPrimaryImage = (product: any) => {
    if (!product?.gallery?.length) return "";
    const primary =
      product.gallery.find((img: any) => img.id === product.primaryImageId) ||
      product.gallery[0];
    return primary?.url || "";
  };

  const recalculatePricing = (
    items: OrderItem[],
    prevPricing?: Order["pricing"],
  ) => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0,
    );

    const tax = Number(prevPricing?.tax || 0);
    const shipping = Number(prevPricing?.shipping || 0);
    const discount = Number(prevPricing?.discount || 0);

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total: subtotal + tax + shipping - discount,
    };
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [field]: value,
        },
      };

      if (parent === "pricing") {
        const subtotal = Number(updated.pricing?.subtotal || 0);
        const tax = Number(updated.pricing?.tax || 0);
        const shipping = Number(updated.pricing?.shipping || 0);
        const discount = Number(updated.pricing?.discount || 0);

        updated.pricing = {
          subtotal,
          tax,
          shipping,
          discount,
          total: subtotal + tax + shipping - discount,
        };
      }

      return updated;
    });
  };

  const addItemToOrder = () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }

    if (selectedProduct?.variants?.length > 0 && !selectedVariant) {
      alert("Please select a variant.");
      return;
    }

    const price =
      Number(selectedVariant?.price) ||
      Number(selectedProduct?.pricing?.price) ||
      Number(selectedProduct?.price) ||
      0;

    const compareAtPrice =
      Number(selectedProduct?.pricing?.compareAtPrice) ||
      Number(selectedProduct?.price) ||
      undefined;

    const orderItem: OrderItem = {
      productId: String(selectedProduct._id),
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedVariant?.sku || selectedProduct.sku,
      quantity: itemQty,
      price,
      compareAtPrice,
      variantId: selectedVariant?._id || null,
      variantTitle: selectedVariant?.title || null,
      selectedOptions: selectedVariant?.optionValues || {},
      image: getPrimaryImage(selectedProduct),
      customization: {},
    };

    const updatedItems = [...(formData.items || []), orderItem];
    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));

    setSelectedProductId("");
    setSelectedVariantId("");
    setItemQty(1);
  };

  const removeItemFromOrder = (index: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems.splice(index, 1);

    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: quantity < 1 ? 1 : quantity,
    };

    const updatedPricing = recalculatePricing(
      updatedItems,
      formData.pricing as Order["pricing"],
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      pricing: updatedPricing,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.items || formData.items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    onSave(formData as Order);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
    <div className="space-y-12 pb-20">
      {/* Form Header Card */}
      <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-none -translate-y-32 translate-x-32" />
        
        <div className="flex items-center gap-8 relative z-10">
          <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
            <Plus size={32} strokeWidth={3} className={isEdit ? "rotate-45" : ""} />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">
              {isEdit ? "Modify Order" : "Configure New Order"}
            </h2>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
              {isEdit
                ? `UPDATING LOGISTICS FOR ${formData.orderNumber}`
                : "INITIALIZING ORDER PARAMETERS AND PLATFORM ALLOCATION"}
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
            <FileText size={22} strokeWidth={2.5} />
          </div>
          Primary Identification
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Customer Email Identification *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 lowercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
              placeholder="customer@platform.com"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              System Session Reference
            </label>
            <input
              type="text"
              value={formData.sessionId}
              onChange={(e) => updateField("sessionId", e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-primary tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200 font-mono"
              placeholder="SYSTEM-GENERATED"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Order Fulfillment Lifecycle *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
            >
              <option value="pending">Pending Verification</option>
              <option value="confirmed">Order Confirmed</option>
              <option value="processing">In Processing</option>
              <option value="shipped">Dispatched & Shipped</option>
              <option value="delivered">Successfully Delivered</option>
              <option value="cancelled">Order Cancelled</option>
            </select>
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Financial Status *
            </label>
            <select
              required
              value={formData.paymentStatus}
              onChange={(e) => updateField("paymentStatus", e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
            >
              <option value="pending">Payment Awaiting</option>
              <option value="paid">Payment Verified</option>
              <option value="failed">Payment Failed</option>
            </select>
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Internal Fulfillment Protocol *
            </label>
            <select
              required
              value={formData.fulfillmentStatus}
              onChange={(e) => updateField("fulfillmentStatus", e.target.value)}
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner appearance-none"
            >
              <option value="unfulfilled">Unfulfilled</option>
              <option value="fulfilled">Fulfilled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item Allocation Section */}
      <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
            <Package size={22} strokeWidth={2.5} />
          </div>
          Asset Allocation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-10 bg-slate-50 border border-slate-100 rounded-none shadow-inner relative">
          <div className="md:col-span-5 space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                setSelectedVariantId("");
              }}
              className="w-full h-14 bg-white border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none appearance-none shadow-sm"
            >
              <option value="">-- SEARCH ASSETS --</option>
              {allProducts?.map((product: any) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4 space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Configuration Variant
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              disabled={!selectedProduct || !selectedProduct?.variants?.length}
              className="w-full h-14 bg-white border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none appearance-none disabled:opacity-40 shadow-sm"
            >
              <option value="">
                {selectedProduct?.variants?.length
                  ? "Choose Configuration"
                  : "Standard Configuration"}
              </option>
              {selectedProduct?.variants?.map((variant: any) => (
                <option key={variant._id} value={variant._id}>
                  {variant.title} | ₹{variant.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={itemQty}
              onChange={(e) => setItemQty(Number(e.target.value) || 1)}
              className="w-full h-14 bg-white border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 focus:border-primary/50 outline-none shadow-sm"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              type="button"
              onClick={addItemToOrder}
              className="w-full h-14 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all rounded-none shadow-lg shadow-primary/20 flex items-center justify-center"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {selectedProduct && (
          <div className="mt-8 p-8 bg-primary/5 border border-primary/10 rounded-none animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white border border-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm font-black">
                {selectedProduct.sku.slice(0, 1)}
              </div>
              <div>
                <div className="text-slate-900 font-black">{selectedProduct.name}</div>
                <div className="text-[10px] text-primary/60 uppercase tracking-widest mt-1 font-black">
                  Core SKU: {selectedProduct.sku} | Unit Price: ₹
                  {(selectedProduct?.pricing?.price || selectedProduct?.price || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 space-y-6">
          {(formData.items || []).length === 0 ? (
            <div className="border-[3px] border-dashed border-slate-100 p-16 rounded-none text-center text-slate-300 text-sm font-black uppercase tracking-[0.4em] bg-slate-50/50">
              Allocation Registry Empty
            </div>
          ) : (
            (formData.items || []).map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || "base"}-${index}`}
                className="flex flex-col md:flex-row md:items-center gap-8 p-6 bg-white border border-slate-100 rounded-none shadow-sm hover:border-primary/20 transition-all group"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover border border-slate-100 rounded-none shadow-sm group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-20 h-20 border border-slate-100 bg-slate-50 rounded-none flex items-center justify-center text-slate-200">
                    <Package size={24} />
                  </div>
                )}

                <div className="flex-1 space-y-1.5">
                  <div className="text-slate-900 font-black text-base group-hover:text-primary transition-colors">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      SKU: {item.sku}
                    </span>
                    {item.variantTitle && (
                      <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-none">
                        {item.variantTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full md:w-32">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Quantity</div>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItemQuantity(index, Number(e.target.value) || 1)
                    }
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 text-slate-900 font-black rounded-xl focus:border-primary/50 outline-none shadow-inner"
                  />
                </div>

                <div className="w-full md:w-32 py-1">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Unit Price</div>
                  <div className="text-slate-500 font-black">₹{item.price.toLocaleString()}</div>
                </div>

                <div className="w-full md:w-40 py-1">
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Row Total</div>
                  <div className="text-primary font-black text-xl">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItemFromOrder(index)}
                  className="h-12 w-12 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center rounded-none shadow-sm transform active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
            <MapPin size={22} strokeWidth={2.5} />
          </div>
          Destination Logistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              First Name *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.firstName}
              onChange={(e) =>
                updateNestedField(
                  "shippingAddress",
                  "firstName",
                  e.target.value,
                )
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.lastName}
              onChange={(e) =>
                updateNestedField("shippingAddress", "lastName", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Contact Identification (Phone) *
            </label>
            <input
              type="tel"
              required
              value={formData.shippingAddress?.phone}
              onChange={(e) =>
                updateNestedField("shippingAddress", "phone", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Zip/Pincode *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.pincode}
              onChange={(e) =>
                updateNestedField("shippingAddress", "pincode", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Primary Address Record *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.address1}
              onChange={(e) =>
                updateNestedField("shippingAddress", "address1", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Secondary Address Parameters
            </label>
            <input
              type="text"
              value={formData.shippingAddress?.address2}
              onChange={(e) =>
                updateNestedField("shippingAddress", "address2", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              City/District *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.city}
              onChange={(e) =>
                updateNestedField("shippingAddress", "city", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              State/Province *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.state}
              onChange={(e) =>
                updateNestedField("shippingAddress", "state", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Country Protocol *
            </label>
            <input
              type="text"
              required
              value={formData.shippingAddress?.country}
              onChange={(e) =>
                updateNestedField("shippingAddress", "country", e.target.value)
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Payment & Logistics Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
          <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
              <CreditCard size={22} strokeWidth={2.5} />
            </div>
            Financial Protocol
          </h3>
          <div className="space-y-8">
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Settlement Method *
              </label>
              <select
                required
                value={formData.payment?.method}
                onChange={(e) =>
                  updateNestedField("payment", "method", e.target.value)
                }
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none appearance-none shadow-inner"
              >
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="razorpay">Razorpay Gateway</option>
                <option value="stripe">Stripe Protocol</option>
              </select>
            </div>

            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Transaction Identification
              </label>
              <input
                type="text"
                value={formData.payment?.transactionId || ""}
                onChange={(e) =>
                  updateNestedField("payment", "transactionId", e.target.value)
                }
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-primary tracking-widest focus:border-primary/50 outline-none shadow-inner font-mono placeholder:text-slate-200"
                placeholder="TXN-ID-XXXXX"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
          <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
              <Truck size={22} strokeWidth={2.5} />
            </div>
            Fulfillment Logistics
          </h3>
          <div className="space-y-8">
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Dispatch Protocol *
              </label>
              <select
                required
                value={formData.shipping?.method}
                onChange={(e) =>
                  updateNestedField("shipping", "method", e.target.value)
                }
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none appearance-none shadow-inner"
              >
                <option value="standard">Standard Fulfillment</option>
                <option value="express">Express Priority</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Logistics Carrier
                </label>
                <input
                  type="text"
                  value={formData.shipping?.carrier || ""}
                  onChange={(e) =>
                    updateNestedField("shipping", "carrier", e.target.value)
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none shadow-inner placeholder:text-slate-200"
                  placeholder="e.g., DHL / FEDEX"
                />
              </div>
              <div className="space-y-3.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                  Tracking Serial
                </label>
                <input
                  type="text"
                  value={formData.shipping?.trackingNumber || ""}
                  onChange={(e) =>
                    updateNestedField(
                      "shipping",
                      "trackingNumber",
                      e.target.value,
                    )
                  }
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-primary tracking-widest focus:border-primary/50 outline-none shadow-inner font-mono placeholder:text-slate-200"
                  placeholder="TRK-XXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Configuration */}
      <div className="bg-white border border-slate-100 p-12 rounded-none shadow-sm relative overflow-hidden">
        <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
            <Tag size={22} strokeWidth={2.5} />
          </div>
          Value Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Gross Subtotal
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.subtotal || 0}
              readOnly
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-none px-6 text-[13px] font-black text-slate-400 outline-none cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Applied Taxation
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.tax || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "tax",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Logistics Expense
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.shipping || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "shipping",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>

          <div className="space-y-3.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Campaign Discount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricing?.discount || 0}
              onChange={(e) =>
                updateNestedField(
                  "pricing",
                  "discount",
                  parseFloat(e.target.value) || 0,
                )
              }
              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-emerald-500 focus:border-primary/50 outline-none transition-all shadow-inner placeholder:text-slate-200"
            />
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Total Order Valuation
            </span>
            <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Platform-calculated aggregate</p>
          </div>
          <div className="text-primary font-black text-5xl tracking-tight">
            ₹{Number(formData.pricing?.total || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center gap-6 justify-end bg-white border border-slate-100 p-8 rounded-none shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 px-10 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-all flex items-center gap-4 rounded-none border border-slate-100"
        >
          <X size={20} strokeWidth={3} /> Abort Configuration
        </button>

        <button
          type="submit"
          className="h-14 px-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center gap-4 rounded-none shadow-xl shadow-primary/20"
        >
          <Save size={20} strokeWidth={3} /> {isEdit ? "Update Order Parameters" : "Commit New Order"}
        </button>
      </div>
    </div>
    </form>
  );
}
