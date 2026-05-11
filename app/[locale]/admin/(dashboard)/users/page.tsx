"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Search,
  Clock,
  User,
  Shield,
  Activity,
  Terminal,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function UsersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { adminusers, loading } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "admin",
      }),
    );
  }, [dispatch]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete team member: "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Deleting ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`Team member ${name} deleted.`, { id: toastId });
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to delete.",
          { id: toastId },
        );
      }
    } catch {
      toast.error("Error deleting team member.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleAdd = () => {
    router.push("/admin/users/new");
  };

  const filteredUsers = useMemo(() => {
    return (adminusers || []).filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [adminusers, searchQuery]);

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary/60">
            <Shield size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Access Management
            </span>
          </div>
          <h1 className="text-5xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Team <span className="text-primary">Members</span>
          </h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            Managing system administration roles and team access credentials within the{" "}
            <span className="text-primary font-black uppercase tracking-widest text-[10px] ring-1 ring-primary/10 px-3 py-1 bg-primary/5 rounded-none">
              Nestcraft Platform
            </span>.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
              <Search size={16} />
            </div>
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 w-full md:w-80 bg-white border-slate-200 rounded-none focus:border-primary/30 transition-all shadow-sm text-[13px] font-black tracking-widest text-slate-900 uppercase"
            />
          </div>

          <Button
            onClick={handleAdd}
            className="rounded-none bg-primary text-white h-12 px-8 gap-3 shadow-xl shadow-primary/20 border-none hover:bg-primary/90 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={3} /> Add Member
          </Button>
        </div>
      </section>

      {/* DATA TABLE */}
      <div className="rounded-none border border-slate-100 bg-white overflow-hidden shadow-sm relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Shield size={160} className="text-primary" />
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] h-16 px-10">
                Team Member
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] h-16 px-10">
                Role & Status
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] h-16 px-10 text-center">
                Ownership
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] h-16 px-10">
                Added On
              </TableHead>
              <TableHead className="text-right font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] h-16 px-10">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-80">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-none animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                      Loading Staff Directory...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-64 text-white/20"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Activity className="h-12 w-12 opacity-5" />
                    <p className="font-black text-[10px] uppercase tracking-[0.3em]">
                      No matching team members found.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={String(user._id)}
                  className="group hover:bg-slate-50/50 border-slate-100 transition-all duration-500"
                >
                  <TableCell className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-black text-xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-widest group-hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-primary/60 transition-colors">
                           <Mail size={10} className="text-primary/40" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <Shield size={12} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                          {user.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("h-2 w-2 rounded-none", user.status === 'active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40 animate-pulse' : 'bg-slate-200')} />
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          user.status === "active" ? "text-emerald-500" : "text-slate-400"
                        )}>
                          {user.status || "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-6">
                    <div className="flex justify-center">
                    {user.isTenantOwner ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-none bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5">
                        <Shield size={12} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Owner</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.2em]">Staff</span>
                    )}
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-6">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Clock size={12} className="text-primary/40" />
                      <span className="text-[11px] font-black tracking-widest uppercase">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "PENDING"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(String(user._id))}
                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === user._id}
                        onClick={() =>
                          handleDelete(String(user._id), user.name)
                        }
                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-500/40 hover:bg-red-50 transition-all shadow-sm"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* FOOTER INFO */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-none border border-slate-100 bg-white px-10 py-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-10 w-1.5 bg-primary shadow-sm rounded-none" />
          <div className="flex items-center gap-5">
             <Activity size={18} className="text-primary" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
              Active Staff Accounts: <span className="text-slate-900 ml-2 tabular-nums">{adminusers.length}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-5 p-6 bg-slate-50 border border-slate-100 rounded-none">
           <Zap size={16} className="text-primary" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Administrative accounts have elevated system privileges. Access and modifications are logged for platform integrity.
           </p>
        </div>
      </section>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-slate-50">
          <div className="flex flex-col items-center gap-8">
            <div className="h-20 w-20 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-2xl shadow-primary/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 animate-pulse">
              Loading Members...
            </span>
          </div>
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
