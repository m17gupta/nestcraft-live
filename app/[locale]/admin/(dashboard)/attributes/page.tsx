"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import {
  ListFilter,
  Plus,
  Edit,
  Trash,
  Search,
  Save,
  X,
  Circle,
  CheckCircle2,
  Upload,
  Database,
  Terminal,
  Zap,
  Layers,
  Settings,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  createAttributeSet,
  deleteAttributeSet,
  updateAttributeSet,
  fetchAttributes,
  bulkImportAttributes,
} from "@/lib/store/attributes/attributesThunk";
import { DataImportModal } from "@/components/admin/DataImportModal";

const attributeSampleData = [
  {
    name: "VEHICLE SPECS",
    key: "vehicle-specs",
    description: "Technical specifications for off-road vehicles.",
    attributes: [
      {
        key: "engine",
        label: "Engine Type",
        type: "select",
        options: ["V6", "V8", "Turbo Diesel"],
      },
      {
        key: "armor",
        label: "Armor Level",
        type: "select",
        options: ["None", "Level 1", "Level 2"],
      },
    ],
  },
];
import { toast } from "sonner";
import {
  AttributeFieldDraft,
  AttributeSetDraft,
  AttributeSetRecord,
} from "@/lib/store/attributes/attributeSlices";

function createEmptyField(): AttributeFieldDraft {
  return {
    key: "",
    label: "",
    type: "select",
    options: "",
    enabled: true,
  };
}

function createEmptyDraft(): AttributeSetDraft {
  return {
    name: "",
    key: "",
    appliesTo: "product",
    contexts: "",
    description: "",
    attributes: [createEmptyField()],
  };
}

function fromRecord(record: AttributeSetRecord): AttributeSetDraft {
  return {
    name: record.name || "",
    key: record.key || "",
    appliesTo: record.appliesTo || "product",
    contexts: Array.isArray(record.contexts) ? record.contexts.join(", ") : "",
    description: record.description || "",
    attributes:
      Array.isArray(record.attributes) && record.attributes.length > 0
        ? record.attributes.map((attribute) => ({
            key: attribute.key || "",
            label: attribute.label || "",
            type: attribute.type || "select",
            options: Array.isArray(attribute.options)
              ? attribute.options.join(", ")
              : "",
            enabled: attribute.enabled !== false,
          }))
        : [createEmptyField()],
  };
}

function toPayload(draft: AttributeSetDraft) {
  return {
    name: draft.name.trim(),
    key: draft.key.trim(),
    appliesTo: draft.appliesTo,
    contexts: draft.contexts
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    description: draft.description.trim(),
    attributes: draft.attributes
      .map((attribute) => ({
        key: attribute.key.trim(),
        label: attribute.label.trim(),
        type: attribute.type || "select",
        options: attribute.options
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        enabled: attribute.enabled,
      }))
      .filter((attribute) => attribute.key && attribute.label),
  };
}

function AttributesPageContent() {
  const { allattributes: records, attributeLoading: loading } = useAppSelector(
    (state: RootState) => state.adminAttributes,
  );

  const dispatch = useAppDispatch();
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AttributeSetDraft>(createEmptyDraft());
  const [showImportModal, setShowImportModal] = useState(false);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return records;
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(keyword) ||
        r.key?.toLowerCase().includes(keyword),
    );
  }, [records, search]);

  const resetForm = () => {
    setForm(createEmptyDraft());
    setEditingId(null);
    setShowForm(false);
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportAttributes(data));
    if (bulkImportAttributes.fulfilled.match(resultAction)) {
      // dispatch(fetchAttributes());
      return { message: `${data.length} Attribute sets saved.` };
    } else {
      throw new Error(
        (resultAction.payload as any)?.message || "Import failed.",
      );
    }
  };

  const handleEdit = (record: AttributeSetRecord) => {
    setForm(fromRecord(record));
    setEditingId(record._id as string);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async () => {
    const payload = toPayload(form);
    if (!payload.name || payload.attributes.length === 0) {
      toast.error(
        "Validation Error: Name and fields are required.",
      );
      return;
    }

    setSaving(true);
    const tId = toast.loading("Saving attributes...");
    try {
      if (editingId) {
        await dispatch(updateAttributeSet({ id: editingId, payload })).unwrap();
        toast.success("Attribute set updated successfully.", { id: tId });
      } else {
        await dispatch(createAttributeSet(payload)).unwrap();
        toast.success("New attribute set created.", { id: tId });
      }
      resetForm();
      dispatch(fetchAttributes());
    } catch (err: any) {
      toast.error("Operation failed.", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: AttributeSetRecord) => {
    if (!confirm(`Are you sure you want to delete attribute set "${record.name}"?`))
      return;
    const tId = toast.loading("Removing record...");
    try {
      await dispatch(deleteAttributeSet(record._id as string)).unwrap();
      toast.success("Attribute set removed successfully.", { id: tId });
      dispatch(fetchAttributes());
    } catch (err: any) {
      toast.error("Deletion failed.", { id: tId });
    }
  };

  const updateAttributeField = (
    index: number,
    patch: Partial<AttributeFieldDraft>,
  ) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.map((a, i) =>
        i === index ? { ...a, ...patch } : a,
      ),
    }));
  };

  const removeAttributeField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-primary/60">
            <Layers size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Product Specification Engine
            </span>
          </div>
          <h1 className="text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-none">
            Attribute <span className="text-primary">Management</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            Configure dynamic specification sets for product variants and catalog logic.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <button
            className="h-14 px-8 bg-white border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all flex items-center gap-4 rounded-none shadow-sm"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={18} strokeWidth={2.5} /> Bulk Import
          </button>
          <button
            className="h-14 px-10 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-4 rounded-none shadow-xl shadow-primary/20"
            onClick={() => {
              setForm(createEmptyDraft());
              setEditingId(null);
              setShowForm(true);
            }}
          >
            <Plus size={20} strokeWidth={3} /> Create New Set
          </button>
        </div>
      </div>

      {/* Editor Form */}
      {showForm && (
        <div className="bg-white border border-slate-100 rounded-none p-10 space-y-10 shadow-sm animate-in slide-in-from-top-6 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Settings size={140} />
          </div>
          
          <div className="flex items-center justify-between border-b border-slate-50 pb-8">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-primary/5 rounded-none flex items-center justify-center text-primary shadow-inner">
                <Settings size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                  {editingId
                    ? "Update Attribute Configuration"
                    : "Configure Specification Set"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                  Define attribute parameters.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center rounded-none"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Set Designation *
              </label>
              <input
                placeholder="e.g. VEHICLE SPECIFICATIONS"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-black text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none shadow-inner placeholder:text-slate-200"
              />
            </div>
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Identification Key *
              </label>
              <input
                placeholder="vehicle-specs"
                value={form.key}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    key: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-"),
                  }))
                }
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-none px-6 text-[13px] font-mono font-bold text-primary lowercase tracking-widest focus:border-primary/50 outline-none shadow-inner"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Operational Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe the purpose of this specification set..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-none p-6 text-[13px] font-bold text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none resize-none shadow-inner placeholder:text-slate-200"
              />
            </div>
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Deployment Contexts (Comma-separated)
              </label>
              <textarea
                value={form.contexts}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contexts: e.target.value }))
                }
                placeholder="e.g. automotive, gear, outdoor"
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-none p-6 text-[13px] font-bold text-slate-900 uppercase tracking-widest focus:border-primary/50 outline-none resize-none shadow-inner placeholder:text-slate-200"
              />
            </div>
          </div>

          {/* Attribute Fields */}
          <div className="space-y-8 pt-10 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Zap size={18} strokeWidth={2.5} className="text-primary" /> Configuration Fields
              </h4>
              <button
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    attributes: [...prev.attributes, createEmptyField()],
                  }))
                }
                className="h-11 px-6 bg-slate-50 border border-slate-200 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-3 rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all"
              >
                <Plus size={16} strokeWidth={3} /> Add Parameter
              </button>
            </div>

            <div className="space-y-6">
              {form.attributes.map((field, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50/50 p-6 border border-slate-100 rounded-none relative group shadow-inner"
                >
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">
                      SYSTEM KEY
                    </label>
                    <input
                      value={field.key}
                      onChange={(e) =>
                        updateAttributeField(idx, { key: e.target.value })
                      }
                      placeholder="field-key"
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-[11px] font-mono font-bold text-primary focus:border-primary/50 outline-none shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">
                      DISPLAY LABEL
                    </label>
                    <input
                      value={field.label}
                      onChange={(e) =>
                        updateAttributeField(idx, { label: e.target.value })
                      }
                      placeholder="Field Label"
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-[11px] font-black text-slate-900 uppercase focus:border-primary/50 outline-none shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">
                      DATA TYPE
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateAttributeField(idx, { type: e.target.value })
                      }
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-[11px] font-black text-slate-900 uppercase focus:border-primary/50 outline-none appearance-none shadow-sm cursor-pointer"
                    >
                      <option value="select">Dropdown Select</option>
                      <option value="multiselect">Multiple Selection</option>
                      <option value="text">Alphanumeric Text</option>
                      <option value="number">Numeric Value</option>
                      <option value="boolean">Boolean Switch</option>
                    </select>
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] leading-none">
                      PARAMETER OPTIONS (CSV)
                    </label>
                    <input
                      value={field.options}
                      onChange={(e) =>
                        updateAttributeField(idx, { options: e.target.value })
                      }
                      placeholder="Option A, Option B, Option C..."
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-4 text-[11px] font-bold text-slate-500 focus:border-primary/50 outline-none shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end justify-center pb-0.5">
                    <button
                      onClick={() => removeAttributeField(idx)}
                      className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl flex items-center justify-center border border-transparent hover:border-red-100"
                    >
                      <Trash size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-5 pt-10 border-t border-slate-50">
            <button
              type="button"
              onClick={resetForm}
              className="h-14 px-10 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all rounded-none border border-slate-100"
            >
              Abort Configuration
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-14 px-12 bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-4 rounded-none transition-all active:scale-95"
            >
              {saving ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-none animate-spin" />
              ) : (
                <Save size={20} strokeWidth={3} />
              )}
              {editingId ? "Update Configuration" : "Deploy Asset Set"}
            </button>
          </div>
        </div>
      )}

      {/* Grid Controls */}
      <div className="flex flex-col sm:flex-row gap-8 items-center justify-between bg-white p-8 rounded-none border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-[500px] group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all"
            size={18}
            strokeWidth={2.5}
          />
          <input
            placeholder="Search attribute sets by designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-16 pr-6 bg-slate-50 border border-slate-200 rounded-none text-[13px] font-black uppercase tracking-widest text-slate-900 placeholder:text-slate-200 focus:border-primary/50 outline-none shadow-inner transition-all"
          />
        </div>
        <div className="flex items-center gap-4 text-slate-300 text-[11px] font-black uppercase tracking-[0.3em]">
          <Database size={16} strokeWidth={2.5} className="text-primary/40" /> Active Sync
        </div>
      </div>

      {/* Attributes Grid */}
      {/* Attributes Grid */}
      {loading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-8 bg-white border border-slate-100 rounded-none shadow-sm">
          <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin" />
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">
            Processing Specification Assets...
          </span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-80 flex flex-col items-center justify-center gap-8 bg-white border border-slate-100 rounded-none shadow-sm text-slate-100">
          <Layers size={80} strokeWidth={1} />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300">
            Attribute set repository is currently empty.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((record) => (
            <div
              key={record._id}
              className="bg-white border border-slate-100 p-8 space-y-6 hover:border-primary/30 transition-all group shadow-sm rounded-none relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Layers size={100} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                  <h3 className="text-lg font-heading font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {record.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-mono font-bold text-primary px-3 py-1 bg-primary/5 border border-primary/10 rounded-lg shadow-inner">
                      {record.key}
                    </span>
                    <span className="h-3 w-[1px] bg-slate-100" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {record.attributes?.length || 0} Dynamic Parameters
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(record)}
                    className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-300 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all rounded-xl flex items-center justify-center shadow-sm"
                  >
                    <Edit size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(record)}
                    className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all rounded-xl flex items-center justify-center shadow-sm"
                  >
                    <Trash size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50 relative z-10">
                {(record.attributes || []).slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"
                  >
                    <span className="text-slate-400 group-hover:text-slate-600 transition-colors">{a.label}</span>
                    <span className="text-primary/40 font-mono">{a.type}</span>
                  </div>
                ))}
                {(record.attributes || []).length > 3 && (
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] pt-2">
                    + {(record.attributes || []).length - 3} Additional parameters active
                  </p>
                )}
              </div>

              {record.description && (
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tight line-clamp-2 pt-4 border-t border-slate-50 relative z-10 leading-relaxed">
                  {record.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Details */}
      <div className="flex items-center gap-4 opacity-30">
        <Terminal size={16} strokeWidth={2.5} className="text-primary" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">
          Attribute Configuration Engine: Secure Data Link Active
        </span>
      </div>

      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        sampleData={attributeSampleData}
        title="Batch Attribute Sync"
        description="Import bulk attributes via JSON."
        fileName="attributes"
      />
    </div>
  );
}

export default function AttributesPage() {
  return (
    <div className="p-8 md:p-12 min-h-screen bg-slate-50/30">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-8">
            <div className="h-12 w-12 border-4 border-slate-100 border-t-primary rounded-none animate-spin shadow-xl shadow-primary/10" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 animate-pulse">
              Initializing Configuration Hub...
            </span>
          </div>
        }
      >
        <AttributesPageContent />
      </Suspense>
    </div>
  );
}
