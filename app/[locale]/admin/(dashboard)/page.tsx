"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Layers,
  Package,
  ShoppingCart,
  Tag,
  Boxes,
  Zap,
  Globe,
  Shield,
  Clock,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  Terminal,
  Lock,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useAppSelector } from "@/lib/store/hooks";

const revenueData = [
  { month: "JAN", revenue: 4200 },
  { month: "FEB", revenue: 5100 },
  { month: "MAR", revenue: 3800 },
  { month: "APR", revenue: 6200 },
  { month: "MAY", revenue: 7300 },
  { month: "JUN", revenue: 8100 },
  { month: "JUL", revenue: 9400 },
];

const statDefinitions = [
  {
    key: "products",
    label: "Total Products",
    icon: Package,
    subLabel: "Furniture Catalog",
    trend: "+2.1%",
    isUp: true,
  },
  {
    key: "categories",
    label: "Categories",
    icon: Layers,
    subLabel: "Global Hierarchy",
    trend: "+12.4%",
    isUp: true,
  },
  {
    key: "orders",
    label: "New Orders",
    icon: ShoppingCart,
    subLabel: "Pending Fulfillment",
    trend: "+12%",
    isUp: true,
  },
  {
    key: "attributes",
    label: "Specifications",
    icon: Tag,
    subLabel: "System Variants",
    trend: "Stable",
    isUp: false,
  },
];

export default function AdminDashboard() {
  const { allCategories, categoryLoading } = useAppSelector(
    (state: RootState) => state.adminCategories,
  );
  const { allattributes, attributeLoading } = useAppSelector(
    (state: RootState) => state.adminAttributes,
  );

  const { allProducts, loading } = useAppSelector(
    (state: RootState) => state.adminProducts,
  );

  const { user } = useSelector((state: RootState) => state.auth);


  const mainLoading = categoryLoading && attributeLoading && loading;

  const stats = {
    products: allProducts?.length || 0,
    categories: allCategories?.length || 0,
    orders: 0,
    attributes: allattributes?.length || 0,
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-slate-100">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-primary/60">
            <Activity size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Administrative Access // Nestcraft Admin
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Global <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Orchestrating digital infrastructure across the{" "}
            <span className="text-primary font-black px-3 py-1 bg-primary/5 rounded-xl border border-primary/10 shadow-sm">
              Nestcraft Ecosystem
            </span>{" "}
            infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col items-end px-6 border-r border-slate-100">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">
              System Status
            </span>
            <span className="text-emerald-500 font-black flex items-center gap-3 text-[10px] uppercase tracking-widest outline-none">
              <div className="h-2.5 w-2.5 rounded-none bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />{" "}
              Live Connection
            </span>
          </div>
          <div className="flex flex-col items-end px-4">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-2">
              Database Sync
            </span>
            <span className="text-slate-900 font-black text-[10px] uppercase tracking-widest">
              Synced
            </span>
          </div>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statDefinitions.map((stat, idx) => (
          <motion.div
            key={stat.key}
            className="group relative bg-white border border-slate-100 p-6 rounded-none hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700" />

            <div className="relative z-10 flex items-start justify-between mb-8">
              <div className="h-14 w-14 flex items-center justify-center rounded-none bg-slate-50 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                <stat.icon
                  size={24}
                  className="text-primary group-hover:text-white transition-colors duration-300"
                />
              </div>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest border",
                  stat.isUp
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-50 text-slate-400 border-slate-100",
                )}
              >
                {stat.isUp ? (
                  <TrendingUp size={12} />
                ) : (
                  <Radio size={12} className="animate-pulse" />
                )}{" "}
                {stat.trend}
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-primary transition-colors">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-heading font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                  {mainLoading ? "---" : stats[stat.key as keyof typeof stats]}
                </span>
                <span className="text-slate-300 font-bold text-[9px] uppercase tracking-widest">
                  Available
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* CHARTS AND LISTS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-none p-10 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 mt-6 mr-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart3 size={120} className="text-primary" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-heading font-black text-slate-900 uppercase tracking-tight">
                Business <span className="text-primary">Metrics</span>
              </h3>
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-4">
                <span className="w-6 h-px bg-slate-100" /> Performance Analytics Cycle
              </p>
            </div>
            <div className="flex gap-4">
              <Button className="h-14 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-slate-900 transition-all active:scale-95 shadow-xl shadow-primary/20">
                View Reports
              </Button>
              <Button variant="outline" className="h-14 px-8 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-none hover:text-primary hover:border-primary/30 hover:bg-slate-50 transition-all">
                Export Data
              </Button>
            </div>
          </div>

          <div className="relative z-10 h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="tacticalRevenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0d6533" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0d6533" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="rgba(0,0,0,0.03)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(0,0,0,0.2)",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(0,0,0,0.2)",
                    fontSize: 10,
                    fontWeight: 900,
                  }}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid rgba(13,101,51,0.2)",
                    borderRadius: "16px",
                    fontSize: "12px",
                    color: "#000",
                    fontWeight: 900,
                  }}
                  itemStyle={{ color: "#0d6533" }}
                  cursor={{ stroke: "rgba(13,101,51,0.3)", strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d6533"
                  strokeWidth={4}
                  fill="url(#tacticalRevenueGradient)"
                  dot={{
                    r: 5,
                    fill: "#0d6533",
                    stroke: "#fff",
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#0d6533",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white border border-slate-100 rounded-none p-10 space-y-10 shadow-sm relative group">
          <div className="flex items-center justify-between pb-8 border-b border-slate-100">
            <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
              System <span className="text-primary">Activity</span>
            </h3>
            <div className="px-4 py-2 rounded-xl bg-emerald-50 text-[9px] font-black uppercase text-emerald-600 tracking-[0.3em] border border-emerald-100">
              Live Feed
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                label: "Modern Velvet Sofa Ordered",
                time: "2 min ago",
                icon: ShoppingCart,
                status: "Confirmed",
              },
              {
                label: "New Product Added",
                time: "1 hour ago",
                icon: Package,
                status: "Complete",
              },
              {
                label: "Category Hierarchy Updated",
                time: "3 hours ago",
                icon: Layers,
                status: "Updated",
              },
              {
                label: "System Health Diagnostics",
                time: "1 day ago",
                icon: Activity,
                status: "Nominal",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex gap-5 group cursor-pointer p-4 rounded-none border border-transparent hover:border-slate-50 hover:bg-slate-50 transition-all relative overflow-hidden"
              >
                <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                  <activity.icon size={20} />
                </div>
                <div className="flex flex-col justify-center overflow-hidden space-y-1.5">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                    {activity.label}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      {activity.time}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-none border tracking-[0.2em] uppercase",
                        activity.status === "Alert"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100",
                      )}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -rotate-45 translate-x-12 -translate-y-12" />
            <div className="flex items-center gap-4">
              <Shield className="text-primary" size={20} strokeWidth={2.5} />
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                System Security Framework
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">
              All system transmissions are secure and operational.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
