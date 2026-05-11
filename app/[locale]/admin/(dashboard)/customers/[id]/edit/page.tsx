"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { CustomerForm } from "@/components/admin/customers/CustomerForm";
import { toast } from "sonner";
import { fetchUsers, updateUser } from "@/lib/store/users/usersThunk";

export default function EditCustomerPage() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("currentPage")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;
  const role = searchParams.get("role") || "customer";
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const {
    customers,
    loading: storeLoading,
    hasFetchedCustomers,
  } = useAppSelector((state) => state.adminUsers);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasFetchedCustomers) {
      dispatch(fetchUsers({ role, currentPage, itemsPerPage }));
    }
  }, [hasFetchedCustomers, dispatch, role, currentPage, itemsPerPage]);

  useEffect(() => {
    if (hasFetchedCustomers) {
      const found = customers.find((c) => String(c._id) === String(id));
      if (found) {
        setCustomer(found);
      } else {
        toast.error("Customer not found.");
        router.push("/admin/customers");
      }
    }
  }, [id, customers, hasFetchedCustomers, router]);

  const handleSubmit = async (formData: any) => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating customer...");
    try {
      const result = await dispatch(
        updateUser({ id: id as string, userData: formData }),
      );
      if (updateUser.fulfilled.match(result)) {
        toast.success("Customer updated successfully.", { id: toastId });
        router.push(
          `/admin/customers?role=${role}&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
        );
      } else {
        toast.error((result.payload as string) || "Failed to update customer.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error updating customer.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!hasFetchedCustomers || !customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="h-16 w-16 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-sm" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
          Loading Customer Details...
        </span>
      </div>
    );
  }

  return (
    <div className="py-12">
      <CustomerForm
        initialData={customer}
        onSubmit={handleSubmit}
        loading={loading}
        title="Edit Customer Profile"
      />
    </div>
  );
}
