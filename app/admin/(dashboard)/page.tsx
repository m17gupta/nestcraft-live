"use client";

import { useEffect, useState } from "react";
import { Package, Tags, Layers, ShoppingCart } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    attributes: 0
  });

  useEffect(() => {
    // In a real scenario, we'd fetch actual counts from an API route.
    // For this demonstration, we'll fetch list sizes or display loading states.
    const fetchStats = async () => {
      try {
        const [prodRes, catRes, attrRes, ordRes] = await Promise.all([
          fetch("/api/ecommerce/products"),
          fetch("/api/ecommerce/categories"),
          fetch("/api/ecommerce/attributes"),
          fetch("/api/ecommerce/orders")
        ]);

        const products = await prodRes.json();
        const categories = await catRes.json();
        const attributes = await attrRes.json();
        const orders = await ordRes.json();

        setStats({
          products: products.length || 0,
          categories: categories.length || 0,
          attributes: attributes.length || 0,
          orders: orders.length || 0,
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black uppercase tracking-tight text-secondary">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your KalpZero E-commerce store.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Products</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.products}</div>
          <p className="text-xs text-muted-foreground">Active in inventory</p>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Categories</h3>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.categories}</div>
          <p className="text-xs text-muted-foreground">Store sections</p>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Orders</h3>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.orders}</div>
          <p className="text-xs text-muted-foreground">Fulfillment items</p>
        </div>

        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Attribute Sets</h3>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{stats.attributes}</div>
          <p className="text-xs text-muted-foreground">Filter keys</p>
        </div>
      </div>
    </div>
  );
}
