"use client";
"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { defaultInstagramData } from "./instagramData";

const InstagramGallery = ({ section: propSection }: { section?: any }) => {
  const pathname = usePathname();
  const currentPages = useAppSelector((state) => state.pages.currentPages);

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const getCurrentSection = useMemo(() => {
    if (!currentPages || !Array.isArray(currentPages.content)) return;
    return currentPages.content.find((page: any) => page?.adminTitle === "Instagram Gallery");
  }, [currentPages]);

  const section = propSection || getCurrentSection;

  const p = (section as any)?.props || defaultInstagramData.props;
  const items = (section as any)?.content || defaultInstagramData.content;

  const getV = (field: any) => {
    if (!field) return "";
    const val = field.value !== undefined ? field.value : field;
    if (val && typeof val === "object") return val[lang] || val.en || "";
    return val || "";
  };

  const badge = getV(p.badge);
  const heading = getV(p.heading);
  const buttonLabel = getV(p.buttonLabel);
  const buttonLink = p.buttonLink?.value || p.buttonLink || "https://instagram.com";

  return (
  <section
    data-annotate-id="home-instagram-gallery-section"
    className="md:py-[120px] md:px-[5%] py-[50px] px-[5%] "
  >
    <div className="flex justify-between items-end mb-[60px] gap-[18px]">
      <div>
        <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
          {badge}
        </p>
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
          {heading}
        </h2>
      </div>
      <a 
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 h-11 rounded-full border border-secondary/45 text-foreground text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary/15 transition-all flex items-center"
      >
        {buttonLabel}
      </a>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {items.map((img: any, idx: number) => {
        const url = img?.props?.image?.value || img?.url || (typeof img === "string" ? img : "");
        return (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="h-[180px] rounded-lg overflow-hidden bg-muted/10 border border-border relative group cursor-pointer"
          >
            <img
              src={url}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-160" />
          </motion.div>
        );
      })}
    </div>
  </section>
  );
};

export default InstagramGallery;
