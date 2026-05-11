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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  Search,
  MapPin,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Terminal,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function CustomersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { customers, loading, totalCustomers } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("currentPage")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;

  const totalPages = Math.max(
    1,
    Math.ceil((totalCustomers || 0) / itemsPerPage),
  );

  const updateQueryParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "customer",
        itemsPerPage,
        currentPage,
      }),
    );
  }, [dispatch, currentPage, itemsPerPage]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove customer: "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Processing removal of ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`Customer profile ${name} removed successfully.`, { id: toastId });
        dispatch(
          fetchUsers({
            role: "customer",
            itemsPerPage,
            currentPage,
          }),
        );
      } else {
        toast.error(
          (resultAction.payload as string) || "Operation failed.",
          { id: toastId },
        );
      }
    } catch {
      toast.error("System error during customer removal.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(
      `/admin/customers/${id}/edit?role=customer&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
    );
  };

  const handleAdd = () => {
    router.push("/admin/customers/new");
  };

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)),
    );
  }, [customers, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateQueryParams({ currentPage: page });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateQueryParams({
      itemsPerPage: Number(e.target.value),
      currentPage: 1,
    });
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-slate-100">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-primary/60">
            <User size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Customer Relation Management
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Customer <span className="text-primary">Database</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Managing global customer profiles and interaction channels within the{" "}
            <span className="text-primary font-black uppercase tracking-widest text-[9px] ring-1 ring-primary/10 px-4 py-1.5 bg-primary/5 rounded-none shadow-sm">
              Nestcraft Ecosystem
            </span>
          </p>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-300 group-focus-within:text-primary transition-all pointer-events-none">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <Input
              placeholder="Search customer records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 h-14 w-full md:w-96 bg-white border-slate-200 rounded-none focus:border-primary/50 transition-all shadow-sm text-[13px] font-black tracking-widest text-slate-900 uppercase placeholder:text-slate-200"
            />
          </div>

          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="h-14 rounded-none border border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 focus:border-primary/50 outline-none transition-all cursor-pointer shadow-sm"
          >
            <option value={10}>10 Records</option>
            <option value={25}>25 Records</option>
            <option value={50}>50 Records</option>
          </select>

          <Button
            onClick={handleAdd}
            className="rounded-none bg-primary text-white h-14 px-10 gap-4 shadow-xl shadow-primary/20 border-none hover:bg-primary/90 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> New Profile
          </Button>
        </div>
      </section>

      {/* DATA TABLE */}
      <div className="rounded-none border border-slate-100 bg-white overflow-hidden shadow-sm relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <User size={180} className="text-primary" />
        </div>
        
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            <TableRow className="hover:bg-transparent border-slate-100 h-20">
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] px-10">
                Client Profile
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] px-10">
                Communication Parameters
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] px-10 text-center">
                Address Assets
              </TableHead>
              <TableHead className="font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] px-10">
                Onboarding
              </TableHead>
              <TableHead className="text-right font-black text-slate-400 uppercase tracking-[0.4em] text-[10px] px-10">
                Protocol
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="text-center h-96">
                  <div className="flex flex-col items-center gap-8">
                    <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-900 animate-pulse">
                      Loading Customers...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow className="border-none">
                <TableCell
                  colSpan={5}
                  className="text-center h-80 text-slate-200"
                >
                  <div className="flex flex-col items-center gap-6">
                    <Activity className="h-20 w-20 opacity-[0.05]" strokeWidth={1} />
                    <p className="font-black text-[11px] uppercase tracking-[0.4em]">
                      No matching records detected in database.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={String(customer._id)}
                  className="group hover:bg-slate-50/50 border-slate-100 transition-all duration-500"
                >
                  <TableCell className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-black text-xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-widest group-hover:text-primary transition-colors">
                          {customer.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                          ID: {String(customer._id).slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-8">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-4 text-slate-500 group-hover:text-primary transition-all">
                        <Mail size={14} strokeWidth={2.5} className="text-primary/40" />
                        <span className="text-[12px] font-black tracking-widest uppercase">
                          {customer.email}
                        </span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-4 text-slate-500 group-hover:text-primary transition-all">
                          <Phone size={14} strokeWidth={2.5} className="text-primary/40" />
                          <span className="text-[12px] font-black tracking-widest uppercase">
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-100 rounded-none shadow-inner group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                        <MapPin size={12} strokeWidth={2.5} className="text-primary/50" />
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                          {customer.addresses?.length || 0}
                        </span>
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        Assets
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Clock size={14} strokeWidth={2.5} className="text-primary/30" />
                      <span className="text-[11px] font-black tracking-widest uppercase text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(String(customer._id))}
                        className="h-10 w-10 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={deletingId === customer._id}
                        onClick={() =>
                          handleDelete(String(customer._id), customer.name)
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

      {/* FOOTER PAGINATION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-none border border-slate-100 bg-white px-10 py-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="h-10 w-1.5 bg-primary/30 rounded-none shadow-sm" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Active Accounts:{" "}
            <span className="text-slate-900 font-black ml-2 tabular-nums">
              {totalCustomers || 0}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-12 px-8 rounded-none bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-primary/5 hover:border-primary/20 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={18} className="mr-3" strokeWidth={3} /> Previous Page
          </Button>

          <div className="px-8 py-3 bg-white border border-slate-100 rounded-none text-[12px] font-black text-primary uppercase tracking-[0.4em] shadow-inner">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="ghost"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-12 px-8 rounded-none bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-primary/5 hover:border-primary/20 disabled:opacity-30 transition-all shadow-sm"
          >
            Next Page <ChevronRight size={18} className="ml-3" strokeWidth={3} />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-slate-50">
          <div className="flex flex-col items-center gap-8">
            <div className="h-20 w-20 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-2xl shadow-primary/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary animate-pulse">
              Initializing Secure Registry Link...
            </span>
          </div>
        </div>
      }
    >
      <CustomersPageContent />
    </Suspense>
  );
}
