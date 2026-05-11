"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Plus,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
} from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { CountrySearchModal } from "@/components/admin/branding/CountrySearchModal";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchBrandingThunk,
  saveBrandingThunk,
} from "@/lib/store/branding/brandingThunks";
import {
  setBranding,
  updateBrandingState,
} from "@/lib/store/branding/brandingSlice";

// Type Definitions
interface Logo {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface CompanyInfo {
  name: string;
  tagline: string;
  foundedYear: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  isPrimary: boolean;
}

interface ContactInfo {
  primaryEmail: string;
  supportEmail: string;
  phoneDisplay: boolean;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}

interface LegalInfo {
  companyLegalName: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  copyrightText: string;
}

interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  enabled: boolean;
}

interface LanguageConfig {
  available: Language[];
  default: string;
}

interface CurrencyConfig {
  available: Currency[];
  default: string;
}

// Theme colors removed

interface BrandConfiguration {
  logos: Logo[];
  companyInfo: CompanyInfo;
  locations: Location[];
  contact: ContactInfo;
  socialMedia: SocialMedia[];
  legal: LegalInfo;
  languages: LanguageConfig;
  currencies: CurrencyConfig;
}

type SectionId =
  | "logo"
  | "company"
  | "locations"
  | "contact"
  | "social"
  | "legal"
  | "regional";

interface Section {
  id: SectionId;
  label: string;
}

export default function BrandingManager() {
  const dispatch = useAppDispatch();
  const { config: brandConfig, isLoading: loading } = useAppSelector(
    (state) => state.branding,
  );

  useEffect(() => {
    if (!brandConfig) {
      dispatch(fetchBrandingThunk());
    }
  }, [dispatch, brandConfig]);

  const saveConfiguration = async () => {
    if (brandConfig) {
      dispatch(saveBrandingThunk(brandConfig));
    }
  };

  const [activeSection, setActiveSection] = useState<SectionId>("logo");

  const addLogo = (): void => {
    const baseConfig: BrandConfiguration = brandConfig || {
      logos: [],
      companyInfo: { name: "", tagline: "", foundedYear: "" },
      locations: [],
      contact: { primaryEmail: "", supportEmail: "", phoneDisplay: true },
      socialMedia: [],
      legal: {
        companyLegalName: "",
        privacyPolicyUrl: "",
        termsUrl: "",
        copyrightText: "",
      },
      languages: { available: [], default: "" },
      currencies: { available: [], default: "" },
    };

    const updatedConfig = {
      ...baseConfig,
      logos: [
        ...baseConfig.logos,
        {
          id: Date.now().toString(),
          url: "",
          alt: "New Logo",
          width: 120,
          height: 40,
        },
      ],
    };

    if (!brandConfig) {
      dispatch(setBranding(updatedConfig));
    } else {
      dispatch(updateBrandingState(updatedConfig));
    }
  };

  const removeLogo = (id: string): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        logos: brandConfig.logos.filter((l) => l.id !== id),
      }),
    );
  };

  const updateLogo = (id: string, field: keyof Logo, value: any): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        logos: brandConfig.logos.map((l) =>
          l.id === id ? { ...l, [field]: value } : l,
        ),
      }),
    );
  };

  const updateCompanyInfo = <K extends keyof CompanyInfo>(
    field: K,
    value: CompanyInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        companyInfo: { ...brandConfig.companyInfo, [field]: value },
      }),
    );
  };

  const updateLocation = <K extends keyof Location>(
    id: number,
    field: K,
    value: Location[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        locations: brandConfig.locations.map((loc) =>
          loc.id === id ? { ...loc, [field]: value } : loc,
        ),
      }),
    );
  };

  const addLocation = (): void => {
    const baseConfig: BrandConfiguration = brandConfig || {
      logos: [],
      companyInfo: { name: "", tagline: "", foundedYear: "" },
      locations: [],
      contact: { primaryEmail: "", supportEmail: "", phoneDisplay: true },
      socialMedia: [],
      legal: {
        companyLegalName: "",
        privacyPolicyUrl: "",
        termsUrl: "",
        copyrightText: "",
      },
      languages: { available: [], default: "" },
      currencies: { available: [], default: "" },
    };

    const newId = Math.max(...baseConfig.locations.map((l) => l.id), 0) + 1;
    const updatedConfig = {
      ...baseConfig,
      locations: [
        ...baseConfig.locations,
        {
          id: newId,
          name: "",
          address: "",
          phone: "",
          isPrimary: false,
        },
      ],
    };

    if (!brandConfig) {
      dispatch(setBranding(updatedConfig));
    } else {
      dispatch(updateBrandingState(updatedConfig));
    }
  };

  const removeLocation = (id: number): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        locations: brandConfig.locations.filter((loc) => loc.id !== id),
      }),
    );
  };

  const updateSocial = <K extends keyof SocialMedia>(
    index: number,
    field: K,
    value: SocialMedia[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        socialMedia: brandConfig.socialMedia.map((social, i) =>
          i === index ? { ...social, [field]: value } : social,
        ),
      }),
    );
  };

  const addSocialMedia = (): void => {
    const baseConfig: BrandConfiguration = brandConfig || {
      logos: [],
      companyInfo: { name: "", tagline: "", foundedYear: "" },
      locations: [],
      contact: { primaryEmail: "", supportEmail: "", phoneDisplay: true },
      socialMedia: [],
      legal: {
        companyLegalName: "",
        privacyPolicyUrl: "",
        termsUrl: "",
        copyrightText: "",
      },
      languages: { available: [], default: "" },
      currencies: { available: [], default: "" },
    };

    const updatedConfig = {
      ...baseConfig,
      socialMedia: [
        ...baseConfig.socialMedia,
        {
          platform: "",
          url: "",
          icon: "Globe",
          enabled: true,
        },
      ],
    };

    if (!brandConfig) {
      dispatch(setBranding(updatedConfig));
    } else {
      dispatch(updateBrandingState(updatedConfig));
    }
  };

  const removeSocial = (index: number): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        socialMedia: brandConfig.socialMedia.filter((_, i) => i !== index),
      }),
    );
  };

  const updateContact = <K extends keyof ContactInfo>(
    field: K,
    value: ContactInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        contact: { ...brandConfig.contact, [field]: value },
      }),
    );
  };

  const updateLegal = <K extends keyof LegalInfo>(
    field: K,
    value: LegalInfo[K],
  ): void => {
    if (!brandConfig) return;
    dispatch(
      updateBrandingState({
        legal: { ...brandConfig.legal, [field]: value },
      }),
    );
  };

  const toggleLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.map((lang) =>
      lang.code === code ? { ...lang, enabled: !lang.enabled } : lang,
    );

    let newDefault = brandConfig.languages.default;
    if (code === brandConfig.languages.default) {
      const firstEnabled = available.find((l) => l.enabled);
      if (firstEnabled) newDefault = firstEnabled.code;
    }

    dispatch(
      updateBrandingState({
        languages: {
          ...brandConfig.languages,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const setDefaultLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.map((lang) =>
      lang.code === code ? { ...lang, enabled: true } : lang,
    );
    dispatch(
      updateBrandingState({
        languages: {
          ...brandConfig.languages,
          available,
          default: code,
        },
      }),
    );
  };

  const toggleCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.map((curr) =>
      curr.code === code ? { ...curr, enabled: !curr.enabled } : curr,
    );

    let newDefault = brandConfig.currencies.default;
    if (code === brandConfig.currencies.default) {
      const firstEnabled = available.find((c) => c.enabled);
      if (firstEnabled) newDefault = firstEnabled.code;
    }

    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const setDefaultCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.map((curr) =>
      curr.code === code ? { ...curr, enabled: true } : curr,
    );
    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: code,
        },
      }),
    );
  };

  const removeLanguage = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.languages.available.filter(
      (l) => l.code !== code,
    );
    let newDefault = brandConfig.languages.default;
    if (code === brandConfig.languages.default) {
      newDefault = available.length > 0 ? available[0].code : "";
    }
    dispatch(
      updateBrandingState({
        languages: { ...brandConfig.languages, available, default: newDefault },
      }),
    );
  };

  const removeCurrency = (code: string): void => {
    if (!brandConfig) return;
    const available = brandConfig.currencies.available.filter(
      (c) => c.code !== code,
    );
    let newDefault = brandConfig.currencies.default;
    if (code === brandConfig.currencies.default) {
      newDefault = available.length > 0 ? available[0].code : "";
    }
    dispatch(
      updateBrandingState({
        currencies: {
          ...brandConfig.currencies,
          available,
          default: newDefault,
        },
      }),
    );
  };

  const sections: Section[] = [
    { id: "logo", label: "Logo & Identity Assets" },
    { id: "company", label: "Company Information" },
    { id: "locations", label: "Office Locations" },
    { id: "contact", label: "Contact Channels" },
    { id: "social", label: "Social Presence" },
    { id: "regional", label: "Regional Settings" },
    { id: "legal", label: "Legal & Compliance" },
  ];

  const handleCountrySelect = (data: {
    languages: any[];
    currencies: any[];
    countryName: string;
  }) => {
    // If brandConfig is null, we initialize a default structure
    const baseConfig: BrandConfiguration = brandConfig || {
      logos: [],
      companyInfo: { name: "", tagline: "", foundedYear: "" },
      locations: [],
      contact: { primaryEmail: "", supportEmail: "", phoneDisplay: true },
      socialMedia: [],
      legal: {
        companyLegalName: "",
        privacyPolicyUrl: "",
        termsUrl: "",
        copyrightText: "",
      },
      languages: { available: [], default: "" },
      currencies: { available: [], default: "" },
    };

    const currentLanguages = baseConfig.languages?.available || [];
    const newLanguages = [...currentLanguages];

    data.languages.forEach((lang) => {
      if (!newLanguages.find((l) => l.code === lang.code)) {
        newLanguages.push({ ...lang, enabled: true });
      }
    });

    const currentCurrencies = baseConfig.currencies?.available || [];
    const newCurrencies = [...currentCurrencies];

    data.currencies.forEach((curr) => {
      if (!newCurrencies.find((c) => c.code === curr.code)) {
        newCurrencies.push({ ...curr, enabled: true });
      }
    });

    const updatedConfig = {
      ...baseConfig,
      languages: {
        ...baseConfig.languages,
        available: newLanguages,
        default:
          baseConfig.languages?.default ||
          (newLanguages.length > 0 ? newLanguages[0].code : ""),
      },
      currencies: {
        ...baseConfig.currencies,
        available: newCurrencies,
        default:
          baseConfig.currencies?.default ||
          (newCurrencies.length > 0 ? newCurrencies[0].code : ""),
      },
    };

    if (!brandConfig) {
      dispatch(setBranding(updatedConfig));
    } else {
      dispatch(updateBrandingState(updatedConfig));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-slate-200 border-t-primary rounded-none animate-spin" />
          <p className="text-primary font-bold tracking-widest text-sm uppercase">
            Loading Brand Details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-slate-200 pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-heading font-black tracking-tight text-slate-900 uppercase">
                Brand <span className="text-primary">Identity</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Visual Assets • Identity Management • Store Settings
              </p>
            </div>
            <Button
              onClick={saveConfiguration}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-black text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 uppercase"
            >
              Save Configuration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <div className="bg-white border border-slate-100 rounded-none overflow-hidden shadow-sm sticky top-10">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">
                  Management Sections
                </h3>
              </div>
              <nav className="p-3 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-5 py-4 text-[11px] font-black tracking-widest transition-all rounded-none uppercase ${
                      activeSection === section.id
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-slate-400 hover:text-primary hover:bg-slate-50"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white border border-slate-100 p-10 rounded-none shadow-sm min-h-[600px]">
              {/* LOGO SECTION */}
              {activeSection === "logo" && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                    <h2 className="text-3xl font-heading font-black tracking-tight text-slate-900 uppercase">
                      Identity <span className="text-primary">Assets</span>
                    </h2>
                    <Button
                      onClick={addLogo}
                      className="bg-primary hover:bg-primary/90 text-white font-black flex items-center gap-3 rounded-none h-14 px-8 uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20"
                    >
                      <Plus className="w-5 h-5" strokeWidth={3} /> New Identity
                      Asset
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {brandConfig &&
                      brandConfig.logos.map((logo, index) => (
                        <div
                          key={logo.id}
                          className="bg-slate-50 border border-slate-100 p-8 rounded-none flex flex-col md:flex-row items-start gap-10 relative group hover:border-primary/20 transition-all duration-500"
                        >
                          {brandConfig.logos.length > 1 && (
                            <button
                              onClick={() => removeLogo(logo.id)}
                              className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                          <div className="w-full md:w-1/3">
                            <label className="block text-[10px] font-black text-slate-400 mb-6 tracking-[0.3em] uppercase">
                              Identity Asset {index + 1}
                            </label>
                            <div className="border-2 border-slate-100 border-dashed rounded-none p-10 flex flex-col items-center justify-center min-h-[220px] bg-white group-hover:bg-white/50 transition-all shadow-inner relative overflow-hidden">
                              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                                <Layers size={120} />
                              </div>
                              {logo.url ? (
                                <div className="w-full h-full flex flex-col items-center gap-6">
                                  <img
                                    src={logo.url}
                                    alt={logo.alt}
                                    className="max-h-24 max-w-full drop-shadow-sm"
                                    style={{
                                      width: logo.width || "auto",
                                      height: logo.height || "auto",
                                    }}
                                  />
                                  <MediaLibraryModal
                                    onSelect={(media) => {
                                      updateLogo(logo.id, "url", media.url);
                                      updateLogo(logo.id, "alt", media.alt);
                                    }}
                                    trigger={
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-primary rounded-none shadow-sm font-bold text-[10px] uppercase tracking-widest transition-all"
                                      >
                                        Change Image
                                      </Button>
                                    }
                                  />
                                </div>
                              ) : (
                                <MediaLibraryModal
                                  onSelect={(media) => {
                                    updateLogo(logo.id, "url", media.url);
                                    updateLogo(logo.id, "alt", media.alt);
                                  }}
                                  trigger={
                                    <div className="text-center cursor-pointer hover:text-primary transition-colors group/upload">
                                      <Upload className="w-10 h-10 mx-auto mb-4 text-slate-300 group-hover/upload:text-primary transition-all" />
                                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Select Asset
                                      </p>
                                    </div>
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 space-y-6">
                            <div>
                              <label className="block text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">
                                Alt Description
                              </label>
                              <input
                                type="text"
                                value={logo.alt}
                                onChange={(e) =>
                                  updateLogo(logo.id, "alt", e.target.value)
                                }
                                className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">
                                  Width (px)
                                </label>
                                <input
                                  type="number"
                                  value={logo.width}
                                  onChange={(e) =>
                                    updateLogo(
                                      logo.id,
                                      "width",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">
                                  Height (px)
                                </label>
                                <input
                                  type="number"
                                  value={logo.height}
                                  onChange={(e) =>
                                    updateLogo(
                                      logo.id,
                                      "height",
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* COMPANY INFO SECTION */}
              {activeSection === "company" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                    Company <span className="text-primary">Profile</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Legal Entity Name
                      </label>
                      <input
                        type="text"
                        value={brandConfig ? brandConfig.companyInfo.name : ""}
                        onChange={(e) =>
                          updateCompanyInfo("name", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Brand Tagline / Mission Statement
                      </label>
                      <textarea
                        value={
                          brandConfig ? brandConfig.companyInfo.tagline : ""
                        }
                        onChange={(e) =>
                          updateCompanyInfo("tagline", e.target.value)
                        }
                        rows={4}
                        className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm font-medium resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Established Since
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.companyInfo.foundedYear : ""
                        }
                        onChange={(e) =>
                          updateCompanyInfo("foundedYear", e.target.value)
                        }
                        className="w-full bg-white border border-slate-200 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATIONS SECTION */}
              {activeSection === "locations" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                      Store <span className="text-primary">Locations</span>
                    </h2>
                    <Button
                      onClick={addLocation}
                      variant="outline"
                      className="h-10 px-6 border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Location
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {brandConfig &&
                      brandConfig.locations.map((location) => (
                        <div
                          key={location.id}
                          className="bg-slate-50 border border-slate-100 p-8 rounded-none relative group"
                        >
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={location.isPrimary}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "isPrimary",
                                    e.target.checked,
                                  )
                                }
                                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                              />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                Primary Outlet
                              </span>
                            </div>
                            {brandConfig.locations.length > 1 && (
                              <button
                                onClick={() => removeLocation(location.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                Branch Name
                              </label>
                              <input
                                type="text"
                                value={location.name}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "name",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-xl focus:border-primary focus:outline-none transition-all shadow-sm"
                                placeholder="e.g., Downtown Showroom"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                Contact Phone
                              </label>
                              <input
                                type="text"
                                value={location.phone}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "phone",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-xl focus:border-primary focus:outline-none transition-all shadow-sm"
                                placeholder="+1 (XXX) XXX-XXXX"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                Physical Address
                              </label>
                              <input
                                type="text"
                                value={location.address}
                                onChange={(e) =>
                                  updateLocation(
                                    location.id,
                                    "address",
                                    e.target.value,
                                  )
                                }
                                className="w-full bg-white border border-slate-200 px-4 py-3 text-slate-900 rounded-xl focus:border-primary focus:outline-none transition-all shadow-sm"
                                placeholder="Full street address"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* CONTACT SECTION */}
              {activeSection === "contact" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                    Contact <span className="text-primary">Channels</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Primary Business Email
                      </label>
                      <input
                        type="email"
                        value={
                          brandConfig ? brandConfig.contact.primaryEmail : ""
                        }
                        onChange={(e) =>
                          updateContact("primaryEmail", e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Support / Help Desk Email
                      </label>
                      <input
                        type="email"
                        value={
                          brandConfig ? brandConfig.contact.supportEmail : ""
                        }
                        onChange={(e) =>
                          updateContact("supportEmail", e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-4 p-6 bg-slate-50 border border-slate-100 rounded-none shadow-inner">
                      <input
                        type="checkbox"
                        checked={
                          brandConfig ? brandConfig.contact.phoneDisplay : false
                        }
                        onChange={(e) =>
                          updateContact("phoneDisplay", e.target.checked)
                        }
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold text-slate-600">
                        Enable public visibility of phone numbers on the
                        storefront
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA SECTION */}
              {activeSection === "social" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gold tracking-wide">
                      SOCIAL MEDIA CHANNELS
                    </h2>
                    <button
                      onClick={addSocialMedia}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-sm font-bold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ADD PLATFORM
                    </button>
                  </div>
                  <div className="space-y-3">
                    {brandConfig &&
                      brandConfig.socialMedia.map((social, index) => (
                        <div
                          key={index}
                          className="bg-white border border-slate-100 p-6 rounded-none shadow-sm"
                        >
                          <div className="flex items-center gap-6">
                            <input
                              type="checkbox"
                              checked={social.enabled}
                              onChange={(e) =>
                                updateSocial(index, "enabled", e.target.checked)
                              }
                              className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <input
                                type="text"
                                value={social.platform}
                                onChange={(e) =>
                                  updateSocial(
                                    index,
                                    "platform",
                                    e.target.value,
                                  )
                                }
                                placeholder="Platform name (e.g. Instagram)"
                                className="bg-slate-50 border border-slate-100 px-4 py-3 text-slate-900 focus:border-primary focus:outline-none text-xs font-black uppercase tracking-widest rounded-none shadow-inner"
                              />
                              <input
                                type="url"
                                value={social.url}
                                onChange={(e) =>
                                  updateSocial(index, "url", e.target.value)
                                }
                                placeholder="https://social.com/profile"
                                className="bg-slate-50 border border-slate-100 px-4 py-3 text-slate-900 focus:border-primary focus:outline-none text-xs font-black tracking-widest rounded-none shadow-inner"
                              />
                            </div>
                            <button
                              onClick={() => removeSocial(index)}
                              className="text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* REGIONAL & FINANCIAL SECTION */}
              {activeSection === "regional" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                        Regional{" "}
                        <span className="text-primary">& Localization</span>
                      </h2>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        Configure store languages and financial currency units.
                      </p>
                    </div>
                    <CountrySearchModal onSelect={handleCountrySelect} />
                  </div>

                  <div className="space-y-12">
                    {/* Languages Sub-section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                          Active Languages
                        </h3>
                      </div>

                      {brandConfig &&
                      brandConfig.languages.available.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {brandConfig.languages.available.map((lang) => (
                            <div
                              key={lang.code}
                              className={`p-6 rounded-none border transition-all duration-300 ${
                                lang.enabled
                                  ? "border-primary/20 bg-primary/[0.02] shadow-sm"
                                  : "border-slate-100 bg-slate-50/50 opacity-60"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                  <input
                                    type="checkbox"
                                    checked={lang.enabled}
                                    onChange={() => toggleLanguage(lang.code)}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                  />
                                  <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">
                                      {lang.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      CODE: {lang.code.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                {lang.code === brandConfig.languages.default ? (
                                  <span className="px-3 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-none shadow-primary/20">
                                    Primary
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      disabled={!lang.enabled}
                                      onClick={() =>
                                        setDefaultLanguage(lang.code)
                                      }
                                      className={`h-8 px-4 text-[9px] font-black uppercase tracking-widest border transition-all rounded-none ${
                                        lang.enabled
                                          ? "text-primary border-primary/20 hover:bg-primary hover:text-white"
                                          : "text-slate-300 border-slate-100 cursor-not-allowed"
                                      }`}
                                    >
                                      Set Primary
                                    </Button>
                                    <button
                                      onClick={() => removeLanguage(lang.code)}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                      title="Remove language"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 border-2 border-dashed border-slate-100 rounded-none text-center bg-slate-50/30">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                            No regional localization detected.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Currencies Sub-section */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <Layers className="w-5 h-5 text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                          Active Currencies
                        </h3>
                      </div>

                      {brandConfig &&
                      brandConfig.currencies.available.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {brandConfig.currencies.available.map((curr) => (
                            <div
                              key={curr.code}
                              className={`p-6 rounded-none border transition-all duration-300 ${
                                curr.enabled
                                  ? "border-primary/20 bg-primary/[0.02] shadow-sm"
                                  : "border-slate-100 bg-slate-50/50 opacity-60"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                  <input
                                    type="checkbox"
                                    checked={curr.enabled}
                                    onChange={() => toggleCurrency(curr.code)}
                                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                  />
                                  <div className="space-y-1">
                                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                                      <span className="text-primary font-mono bg-white px-2 py-0.5 rounded border border-slate-100 shadow-sm">
                                        {curr.symbol}
                                      </span>{" "}
                                      {curr.name}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                      CURRENCY: {curr.code.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                {curr.code ===
                                brandConfig.currencies.default ? (
                                  <span className="px-3 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-none shadow-primary/20">
                                    Base Unit
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      disabled={!curr.enabled}
                                      onClick={() =>
                                        setDefaultCurrency(curr.code)
                                      }
                                      className={`h-8 px-4 text-[9px] font-black uppercase tracking-widest border transition-all rounded-none ${
                                        curr.enabled
                                          ? "text-primary border-primary/20 hover:bg-primary hover:text-white"
                                          : "text-slate-300 border-slate-100 cursor-not-allowed"
                                      }`}
                                    >
                                      Set Base
                                    </Button>
                                    <button
                                      onClick={() => removeCurrency(curr.code)}
                                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                      title="Remove currency"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-12 border-2 border-dashed border-slate-100 rounded-none text-center bg-slate-50/30">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                            No functional currency units identified.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LEGAL & PAYMENT SECTION */}
              {activeSection === "legal" && (
                <div className="space-y-10 animate-in fade-in duration-500">
                  <h2 className="text-2xl font-heading font-black text-slate-900 uppercase tracking-tight">
                    Legal <span className="text-primary">& Compliance</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Registered Business Name
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.legal.companyLegalName : ""
                        }
                        onChange={(e) =>
                          updateLegal("companyLegalName", e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                          Privacy Policy Link
                        </label>
                        <input
                          type="text"
                          value={
                            brandConfig
                              ? brandConfig.legal.privacyPolicyUrl
                              : ""
                          }
                          onChange={(e) =>
                            updateLegal("privacyPolicyUrl", e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                          Terms of Service Link
                        </label>
                        <input
                          type="text"
                          value={brandConfig ? brandConfig.legal.termsUrl : ""}
                          onChange={(e) =>
                            updateLegal("termsUrl", e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                        Copyright Attribution
                      </label>
                      <input
                        type="text"
                        value={
                          brandConfig ? brandConfig.legal.copyrightText : ""
                        }
                        onChange={(e) =>
                          updateLegal("copyrightText", e.target.value)
                        }
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-slate-900 rounded-none focus:border-primary focus:outline-none transition-all shadow-inner font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
