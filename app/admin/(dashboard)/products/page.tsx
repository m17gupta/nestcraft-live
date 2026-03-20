"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/ecommerce/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your e-commerce product listings and variants.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{prod.name}</span>
                      <span className="text-xs text-muted-foreground">${prod.price}</span>
                    </div>
                  </TableCell>
                  <TableCell>{prod.sku}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      prod.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {prod.status}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">{prod.type}</TableCell>
                  <TableCell>{prod.variantCount} in {prod.totalStock} stock</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive"><Trash className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
