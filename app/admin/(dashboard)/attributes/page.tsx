"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/ecommerce/attributes")
      .then(res => res.json())
      .then(data => setAttributes(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attribute Sets</h1>
          <p className="text-sm text-muted-foreground">Manage properties associated with products (e.g. materials, finishes).</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Attribute Set</Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Attributes Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No attribute sets found.
                </TableCell>
              </TableRow>
            ) : (
              attributes.map((attr) => (
                <TableRow key={attr._id}>
                  <TableCell className="font-medium">{attr.name}</TableCell>
                  <TableCell>{attr.key}</TableCell>
                  <TableCell className="capitalize">{attr.appliesTo}</TableCell>
                  <TableCell>{attr.attributes?.length || 0} attributes</TableCell>
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
