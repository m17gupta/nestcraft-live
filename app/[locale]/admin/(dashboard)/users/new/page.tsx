"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { UserForm } from "@/components/admin/users/UserForm";
import { toast } from "sonner";
import { addUser } from "@/lib/store/users/usersThunk";

export default function NewUserPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Creating new user...");
    try {
      const result = await dispatch(
        addUser({
          userData: formData,
          role: "admin", // Passes "admin" to tell the backend to handle it as a system user
        }),
      );
      if (addUser.fulfilled.match(result)) {
        toast.success("User created successfully.", { id: toastId });
        router.push("/admin/users");
      } else {
        toast.error((result.payload as string) || "Failed to create user.", { id: toastId });
      }
    } catch (err) {
      toast.error("Error creating user.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <UserForm
        onSubmit={handleSubmit}
        loading={loading}
        title="Create New User"
      />
    </div>
  );
}
