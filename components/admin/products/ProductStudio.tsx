"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Package,
  Save,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RootState } from "@/lib/store/store";

import {
  setProductFormField,
  resetProductForm,
  setPricingField,
  setCurrentProduct,
} from "@/lib/store/products/productsSlices";
import { saveProduct } from "@/lib/store/products/productsThunk";
import { fetchAllForm } from "@/lib/store/forms/formsThunk";

import {
  VariantRow,
  sanitizeKey,
  buildCombinationTitle,
  buildVariantCombinations,
  generateSKUWithBaseSKU,
} from "@/lib/admin-products/utils";

import { GeneralInformation } from "./studio/GeneralInformation";
import { PricingInventory } from "./studio/PricingInventory";
import { VisualMedia } from "./studio/VisualMedia";
import { OptionConfiguration } from "./studio/OptionConfiguration";
import { VariantMatrix } from "./studio/VariantMatrix";
import { PublicationSidebar } from "./studio/PublicationSidebar";

export function ProductStudio() {
  const router = useRouter();
  const params = useParams();
  const editId = (params.id as string) || null;
  const dispatch = useAppDispatch();
  const isEditing = Boolean(editId);

  const { allCategories } = useAppSelector(
    (state: RootState) => state.adminCategories,
  );
  const { allattributes } = useAppSelector(
    (state: RootState) => state.adminAttributes,
  );
  const {
    allProducts,
    currentProduct: form,
    saving,
    loading: productLoading,
  } = useAppSelector((state: RootState) => state.adminProducts);
  const { allForms } = useAppSelector((state: RootState) => state.adminForms);

  const [loading, setLoading] = useState(true);
  const [galleryUrlDraft, setGalleryUrlDraft] = useState("");
  const [productSlug, setProductSlug] = useState("");

  const relatedProductCandidates = useMemo(
    () => allProducts.filter((item: any) => item.id !== editId),
    [allProducts, editId],
  );

  console.log("relatedProductCandidates", relatedProductCandidates);

  // // Initial Load
  // useEffect(() => {
  //   const init = async () => {
  //     setLoading(true);
  //     try {
  //       if (isEditing && editId) {
  //         // Wait for products to be fetched before finding
  //       } else {
  //         dispatch(resetProductForm());
  //         setProductSlug("");
  //       }
  //       dispatch(fetchForms());
  //     } catch (err) {
  //       console.error("Product initialization failed", err);
  //       toast.error("Initialization error: Could not connect to data hub.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   init();
  // }, [editId, isEditing, dispatch]);

  // Sync editId with form
  useEffect(() => {
    if (isEditing && editId && allProducts.length > 0) {
      const singleProduct = allProducts.find((item: any) => item.id === editId);
      if (singleProduct) {
        dispatch(setCurrentProduct(singleProduct));
        setProductSlug(singleProduct.slug || "");
      }
    }
  }, [allProducts, editId, isEditing, dispatch]);

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.sku.trim()) {
      return toast.error(
        "Required fields: Product Name and SKU are mandatory.",
      );
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim(),
      slug: productSlug.trim(),
      price: Number(form.pricing.price || 0),
      pricing: {
        ...form.pricing,
        price: Number(form.pricing.price || 0),
        compareAtPrice: Number(form.pricing.compareAtPrice || 0),
        costPerItem: Number(form.pricing.costPerItem || 0),
      },
      variants: form.variants.map((v: any) => ({
        ...v,
        price: Number(v.price || form.pricing.price || 0),
        stock: Number(v.stock || 0),
      })),
    };

    const tId = toast.loading("Saving product details...");

    try {
      const action: any = await dispatch(
        saveProduct({ id: editId || undefined, payload }),
      );
      if (saveProduct.fulfilled.match(action)) {
        toast.success(isEditing ? "Product updated" : "Product saved", {
          id: tId,
        });
        setTimeout(() => router.push("/admin/products"), 1500);
      } else {
        toast.error(action.payload || "Save failed", { id: tId });
      }
    } catch (e) {
      toast.error("Network error detected", { id: tId });
    }
  };

  const regenerateVariants = () => {
    if (!form) return;
    const combos = buildVariantCombinations(form.options);
    const nextVariants: VariantRow[] = combos.map((combo, index) => {
      const existing = form.variants.find((v: any) =>
        Object.entries(combo).every(
          ([key, val]) => v.optionValues[key] === val,
        ),
      );

      return {
        _id: existing?._id || `v-${index}-${Date.now()}`,
        title:
          existing?.title ||
          buildCombinationTitle(combo) ||
          `Variant ${index + 1}`,
        optionValues: combo,
        sku: existing?.sku || generateSKUWithBaseSKU(form.sku, combo),
        price: existing?.price || form.pricing.price,
        stock: existing?.stock || "0",
        productId: existing?.productId || "",
        status: existing?.status || "active",
        createdAt: existing?.createdAt || "",
      };
    });

    dispatch(setProductFormField({ field: "variants", value: nextVariants }));
    toast.info(`Matrix updated: ${nextVariants.length} variants generated`);
  };

  const toggleAttributeSet = (id: string) => {
    if (!form) return;
    const isRemoving = form.attributeSetIds.includes(id);
    const nextIds = isRemoving
      ? form.attributeSetIds.filter((i: string) => i !== id)
      : [...form.attributeSetIds, id];

    const nextOptions = isRemoving
      ? form.options.filter((o: any) => o.attributeSetId !== id)
      : [
          ...form.options,
          ...(
            allattributes.find((s: any) => (s.key || s._id) === id)
              ?.attributes || []
          )
            .filter((a: any) => a.enabled !== false)
            .map((a: any) => ({
              key: sanitizeKey(a.key || a.label || ""),
              label: a.label || a.key || "Option",
              values: a.options || [],
              selectedValues: [],
              useForVariants: false,
              draftValue: "",
              attributeSetId: id,
            })),
        ];

    dispatch(setProductFormField({ field: "attributeSetIds", value: nextIds }));
    dispatch(setProductFormField({ field: "options", value: nextOptions }));
    dispatch(setProductFormField({ field: "variants", value: [] }));
  };

  const toggleCategory = (id: string) => {
    if (!form) return;
    const exists = form.categoryIds.includes(id);
    const nextIds = exists
      ? form.categoryIds.filter((i: string) => i !== id)
      : [...form.categoryIds, id];

    dispatch(setProductFormField({ field: "categoryIds", value: nextIds }));

    if (exists && form.primaryCategoryId === id) {
      dispatch(setProductFormField({ field: "primaryCategoryId", value: "" }));
    } else if (!exists && nextIds.length === 1) {
      dispatch(setProductFormField({ field: "primaryCategoryId", value: id }));
    }
  };

  const addOptionValue = (idx: number) => {
    if (!form) return;
    const opt = form.options[idx];
    if (!opt.draftValue.trim()) return;
    const next = [...form.options];
    next[idx] = {
      ...opt,
      values: [...opt.values, opt.draftValue.trim()],
      selectedValues: [...opt.selectedValues, opt.draftValue.trim()],
      draftValue: "",
    };
    dispatch(setProductFormField({ field: "options", value: next }));
  };

  if (loading || productLoading || !form) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="h-10 w-10 border-4 border-slate-100 border-t-primary rounded-full animate-spin shadow-xl shadow-primary/10" />
        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300 italic">
          Initializing Management Hub...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header Section */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl shadow-slate-200/50 italic">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/admin/products")}
            className="h-14 w-14 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
              {isEditing ? "Update" : "Save"}{" "}
              <span className="text-primary">Product</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1">
              <Terminal size={14} strokeWidth={2.5} className="text-primary/40" />
              {isEditing
                ? `Modifying Serial: ${form.sku}`
                : "Configuring New Product Entry"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            className="h-14 px-10 bg-white border border-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-slate-900 hover:border-slate-200 transition-all active:scale-95 rounded-2xl shadow-sm"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </button>
          <button
            className="h-14 px-12 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-4 rounded-2xl shadow-2xl shadow-primary/30 italic"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={20} strokeWidth={3} />
            )}
            {isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-8">
          <GeneralInformation
            name={form.name}
            sku={form.sku}
            slug={productSlug}
            description={form.description}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onSlugChange={setProductSlug}
          />

          <PricingInventory
            pricing={form.pricing}
            onPricingChange={(field, value) =>
              dispatch(setPricingField({ field: field as any, value }))
            }
          />

          <VisualMedia
            gallery={form.gallery}
            primaryImageId={form.primaryImageId}
            galleryUrlDraft={galleryUrlDraft}
            onGalleryChange={(gallery) =>
              dispatch(
                setProductFormField({ field: "gallery", value: gallery }),
              )
            }
            onPrimaryImageChange={(id) =>
              dispatch(
                setProductFormField({ field: "primaryImageId", value: id }),
              )
            }
            onGalleryUrlDraftChange={setGalleryUrlDraft}
            onAddGalleryItem={(item) => {
              dispatch(
                setProductFormField({
                  field: "gallery",
                  value: [...form.gallery, item],
                }),
              );
              if (!form.primaryImageId) {
                dispatch(
                  setProductFormField({
                    field: "primaryImageId",
                    value: item.id,
                  }),
                );
              }
            }}
          />

          <OptionConfiguration
            attributeSetIds={form.attributeSetIds}
            options={form.options}
            onToggleAttributeSet={toggleAttributeSet}
            onOptionChange={(idx, opt) => {
              const next = [...form.options];
              next[idx] = opt;
              dispatch(setProductFormField({ field: "options", value: next }));
            }}
            onAddOptionValue={addOptionValue}
            onRegenerateVariants={regenerateVariants}
          />

          <VariantMatrix
            variants={form.variants}
            onVariantsChange={(variants) =>
              dispatch(
                setProductFormField({ field: "variants", value: variants }),
              )
            }
          />
        </div>

        {/* Tactical Control Sidebar */}
        <div className="lg:col-span-4">
          <PublicationSidebar
            status={form.status}
            templateKey={form.templateKey}
            allCategories={allCategories}
            categoryIds={form.categoryIds}
            primaryCategoryId={form.primaryCategoryId}
            relatedProductCandidates={relatedProductCandidates}
            relatedProductIds={form.relatedProductIds}
            onFormChange={(field, value) =>
              dispatch(setProductFormField({ field: field as any, value }))
            }
            onToggleCategory={toggleCategory}
            onToggleRelatedProduct={(id) =>
              dispatch(
                setProductFormField({
                  field: "relatedProductIds",
                  value: form.relatedProductIds.includes(id)
                    ? form.relatedProductIds.filter((rid: string) => rid !== id)
                    : [...form.relatedProductIds, id],
                }),
              )
            }
            allForms={allForms}
            formId={(form as any).formId || ""}
          />
        </div>
      </div>
    </div>
  );
}
