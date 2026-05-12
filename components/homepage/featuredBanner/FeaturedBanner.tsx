"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "@/lib/router";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { defaultFeaturedBanner } from "./featuredBannerData";

interface FeaturedBannerProps {
  section?: any;
}

const FeaturedBanner = ({ section: propSection }: FeaturedBannerProps) => {
  const pathname = usePathname();
  const currentPages = useAppSelector((state) => state.pages.currentPages);

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const getCurrentSection = useMemo(() => {
    if (!currentPages || !Array.isArray(currentPages.content)) return;
    return currentPages.content.find((page: any) => page?.adminTitle === "FeaturedBanner");
  }, [currentPages]);

  const section = propSection || getCurrentSection;

  const p = (section as any)?.props || defaultFeaturedBanner.props;
  const rawContent = (section as any)?.content || defaultFeaturedBanner.content;
  const content = Array.isArray(rawContent) ? rawContent : [];

  const getV = (field: any) => {
    if (!field) return "";
    const val = field.value !== undefined ? field.value : field;
    if (val && typeof val === "object") return val[lang] || val.en || "";
    return val || "";
  };

  const badge = getV(p.badge);
  const heading = getV(p.heading);
  const description = getV(p.description);
  const buttonLabel = getV(p.buttonLabel);
  const buttonLink = p.buttonLink?.value || p.buttonLink || "/shop";

  const imgBlock = content?.find((b: any) => b.type === "image");
  const imgUrl = imgBlock?.props?.image?.value || imgBlock?.url || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200";

  return (
    <section
      data-annotate-id="home-featured-banner"
      className="bg-primary text-white grid lg:grid-cols-2 items-center overflow-hidden "
      id="bedroom"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="md:h-[580px] h-[380px]"
      >
        <img
          src={imgUrl}
          alt={imgBlock?.props?.alt?.value || imgBlock?.alt || "Bed"}
          className="w-full h-full object-cover saturate-[1.02] contrast-[1.02]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-[50px] lg:p-[90px]"
      >
        <span className="text-secondary uppercase text-[12px] tracking-[3px] font-black">
          {badge}
        </span>
        <h2 className="text-[38px] lg:text-[48px] font-bold leading-tight mt-2">
          {heading}
        </h2>
        <p className="text-white/80 font-semibold max-w-[540px] mt-3">
          {description}
        </p>
        {buttonLabel && (
          <Link
            href={buttonLink}
            className="mt-5 px-6 h-11 inline-flex items-center rounded-full border border-white/70 text-white text-[14px] font-semibold uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            {buttonLabel}
          </Link>
        )}
      </motion.div>
    </section>
  );
};

export default FeaturedBanner;