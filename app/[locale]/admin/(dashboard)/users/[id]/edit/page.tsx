"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { UserForm } from "@/components/admin/users/UserForm";
import { toast } from "sonner";
import { fetchUsers, updateUser } from "@/lib/store/users/usersThunk";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  
  const { adminusers, loading: fetchLoading } = useAppSelector(
    (state) => state.adminUsers
  );

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (adminusers.length > 0) {
      const user = adminusers.find((u) => String(u._id) === String(id));
      if (user) {
        setUserData(user);
      } else {
         dispatch(fetchUsers({ role: "admin" }));
      }
    } else {
      dispatch(fetchUsers({ role: "admin" }));
    }
  }, [adminusers, id, dispatch]);

  useEffect(() => {
    if (!userData && adminusers.length > 0) {
      const user = adminusers.find((u) => String(u._id) === String(id));
      if (user) {
        setUserData(user);
      }
    }
  }, [adminusers, id, userData]);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    const toastId = toast.loading("Updating user...");
    try {
      const result = await dispatch(
        updateUser({
          id,
          userData: formData,
        }),
      );
      if (updateUser.fulfilled.match(result)) {
        toast.success("User updated successfully.", { id: toastId });
        router.push("/admin/users");
      } else {
        toast.error((result.payload as string) || "Failed to update user.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error updating user.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading && !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="h-16 w-16 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-sm" />
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
          Loading User Details...
        </span>
      </div>
    );
  }

  if (!userData && !fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <div className="text-center space-y-4">
          <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.4em]">
            User not found.
          </p>
          <button 
            onClick={() => router.push('/admin/users')}
            className="text-[10px] font-black text-primary uppercase tracking-[0.4em] hover:text-slate-900 transition-colors underline underline-offset-8 decoration-primary/30 hover:decoration-slate-900/30"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <UserForm
        initialData={userData}
        onSubmit={handleSubmit}
        loading={loading}
        title={`Edit User: ${userData?.name}`}
      />
    </div>
  );
}
