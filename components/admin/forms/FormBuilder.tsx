"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Settings2,
  Terminal,
  Type,
  Hash,
  AlignLeft,
  ChevronDownSquare,
  CheckSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface FormField {
  id: string;
  type: "text" | "number" | "textarea" | "select" | "checkbox";
  label: string;
  name?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select type
}

interface FormBuilderProps {
  initialFields?: FormField[];
  onSave: (name: string, fields: FormField[]) => void;
  initialName?: string;
  loading?: boolean;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialFields = [],
  onSave,
  initialName = "",
  loading = false,
}) => {
  const [formName, setFormName] = useState(initialName);
  const [fields, setFields] = useState<FormField[]>(initialFields);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      name: `field_${Date.now()}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: "",
      required: false,
      options: type === "select" ? ["Option 1"] : undefined,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;
    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];
    setFields(newFields);
  };

  const handleAddFieldOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      updateField(fieldId, {
        options: [...field.options, `Option ${field.options.length + 1}`],
      });
    }
  };

  const updateFieldOption = (
    fieldId: string,
    optIndex: number,
    value: string,
  ) => {
    const field = fields.find((f) => f.id === fieldId);
    if (field && field.options) {
      const newOpts = [...field.options];
      newOpts[optIndex] = value;
      updateField(fieldId, { options: newOpts });
    }
  };

  const getIcon = (type: FormField["type"]) => {
    switch (type) {
      case "text":
        return <Type size={16} />;
      case "number":
        return <Hash size={16} />;
      case "textarea":
        return <AlignLeft size={16} />;
      case "select":
        return <ChevronDownSquare size={16} />;
      case "checkbox":
        return <CheckSquare size={16} />;
      default:
        return <Type size={16} />;
    }
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Configuration Header */}
      <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl relative overflow-hidden group italic">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Settings2 size={160} className="text-primary" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-5 pb-6 border-b border-slate-50">
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary shadow-inner">
              <Terminal size={20} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
              Form <span className="text-primary/80">Builder</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 italic">
                Form Name (Public Reference)
              </Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="ENTER FORM NAME e.g. CUSTOM ORDER FORM"
                className="h-14 bg-slate-50 border-slate-100 rounded-2xl focus:border-primary/30 focus:bg-white transition-all shadow-inner text-[13px] font-bold italic tracking-wider text-slate-900 uppercase px-6"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => onSave(formName, fields)}
                disabled={loading || !formName.trim() || fields.length === 0}
                className="w-full h-14 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] italic hover:bg-slate-900 shadow-xl shadow-primary/20 active:scale-95 transition-all rounded-2xl"
              >
                {loading
                  ? "Saving Changes..."
                  : "Save Form Template"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Field List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4 pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">
              Form Structure (Layout)
            </h4>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 italic">
              {fields.length} Fields Configured
            </span>
          </div>

          {fields.length === 0 ? (
            <div className="h-80 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 bg-slate-50 shadow-inner">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-primary/20 shadow-sm">
                <Plus size={32} strokeWidth={2.5} />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                No fields added yet. Select elements from the sidebar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group/field italic"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 space-y-8">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shadow-inner">
                          {getIcon(field.type)}
                        </div>
                        <div className="flex-1">
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, { label: e.target.value })
                            }
                            placeholder="FIELD LABEL"
                            className="bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-slate-900 font-black uppercase tracking-tighter text-xl italic"
                          />
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover/field:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-xl"
                            onClick={() => moveField(index, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp size={20} strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-xl"
                            onClick={() => moveField(index, "down")}
                            disabled={index === fields.length - 1}
                          >
                            <ChevronDown size={20} strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 size={20} strokeWidth={2.5} />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                            System Identifier (ID)
                          </Label>
                          <Input
                            value={field.name || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                name: e.target.value.replace(/\s+/g, ""),
                              })
                            }
                            placeholder="field_unique_id"
                            className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wider text-slate-900 shadow-inner px-5"
                          />
                        </div>

                        {field.type !== "checkbox" && (
                          <div className="space-y-3">
                            <Label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">
                              Input Placeholder
                            </Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  placeholder: e.target.value,
                                })
                              }
                              placeholder="INSTRUCTIONAL TEXT..."
                              className="h-12 bg-slate-50 border-slate-100 rounded-xl text-[12px] font-bold italic tracking-wider text-slate-900 shadow-inner px-5 uppercase"
                            />
                          </div>
                        )}

                        <div className="flex items-end justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic ml-1">
                            Required Field
                          </Label>
                          <Switch
                            checked={field.required}
                            onCheckedChange={(val) =>
                              updateField(field.id, { required: val })
                            }
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2 italic">
                            Options Configuration
                          </Label>
                          <div className="space-y-3">
                            {field.options?.map((opt, optIdx) => (
                              <div key={optIdx} className="flex gap-3 group/opt">
                                <Input
                                  value={opt}
                                  onChange={(e) =>
                                    updateFieldOption(
                                      field.id,
                                      optIdx,
                                      e.target.value,
                                    )
                                  }
                                  className="h-10 bg-slate-50 border-slate-100 text-[11px] font-bold text-slate-900 uppercase italic rounded-xl px-5 shadow-inner"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                  onClick={() => {
                                    const next = field.options!.filter(
                                      (_, i) => i !== optIdx,
                                    );
                                    updateField(field.id, { options: next });
                                  }}
                                  disabled={field.options!.length <= 1}
                                >
                                  <Trash2 size={16} strokeWidth={2.5} />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              className="w-full h-10 border border-slate-200 border-dashed text-[10px] font-black uppercase text-primary/60 hover:text-primary hover:border-primary/30 rounded-xl italic transition-all active:scale-95 shadow-sm"
                              onClick={() => handleAddFieldOption(field.id)}
                            >
                              <Plus size={14} strokeWidth={2.5} className="mr-2" /> Add New Option
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Component Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl sticky top-24 italic">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 pb-6 border-b border-slate-50 mb-8">
              Form Elements
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  type: "text" as const,
                  label: "Input Field",
                  desc: "Standard alphanumeric data",
                },
                {
                  type: "number" as const,
                  label: "Number Field",
                  desc: "Integer or decimal values",
                },
                {
                  type: "textarea" as const,
                  label: "Text Area",
                  desc: "Multi-line descriptive input",
                },
                {
                  type: "select" as const,
                  label: "Dropdown Menu",
                  desc: "Pre-defined selection list",
                },
                {
                  type: "checkbox" as const,
                  label: "Boolean Toggle",
                  desc: "Binary on/off state",
                },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => addField(item.type)}
                  className="flex items-start gap-5 p-5 rounded-2xl border border-slate-50 bg-slate-50/50 text-left hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all group active:scale-95"
                >
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider italic group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                      {item.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 p-6 bg-primary/5 border border-primary/10 rounded-2xl italic">
              <div className="flex items-center gap-4 mb-3">
                <GripVertical className="text-primary" size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                  Component Info
                </span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase leading-relaxed font-bold tracking-tight">
                Elements are added to the form layout. Drag-and-drop is
                currently manual via order controls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
