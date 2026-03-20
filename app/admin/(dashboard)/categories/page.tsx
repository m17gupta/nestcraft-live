"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/ecommerce/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your store product categories and hierarchies.</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Parent ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell className="capitalize">{cat.type}</TableCell>
                  <TableCell>{cat.parentId || "—"}</TableCell>
                  <TableCell className="text-right">
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
