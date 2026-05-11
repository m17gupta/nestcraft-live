"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { Leaf, BadgeCheck, HeartHandshake, Sparkles } from "lucide-react";
import { defaultDifferenceData } from "./differenceData";

const iconMap: any = {
  Leaf,
  BadgeCheck,
  HeartHandshake,
  Sparkles,
};

const Difference = () => {
  const pathname = usePathname();
  const { currentPages } = useAppSelector((state) => state.pages);

  // 1. Language Detection
  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] === "hi" ? "hi" : "en";
  }, [pathname]);

  // 2. CMS Data Fetching
  const section = useMemo(() => {
    if (!currentPages) return null;
    return currentPages.content?.find((s: any) => s?.adminTitle === "Difference Section");
  }, [currentPages]);

  // 3. Data Merging
  const p = (section as any)?.props || defaultDifferenceData.props;
  const content = (section as any)?.content || defaultDifferenceData.content;

  // Localized values
  const badge = p.badge?.[lang] || p.badge?.en || p.badge || "";
  const heading = p.heading?.[lang] || p.heading?.en || p.heading || "";
  const subheading = p.subheading?.[lang] || p.subheading?.en || p.subheading || "";

  return (
    <section
      data-annotate-id="about-values-section"
      className="bg-[#06130B] text-white"
    >
      <div className="mx-auto max-w-7xl px-[5%] py-24">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-[12px] font-black uppercase tracking-[3px] text-secondary"
          >
            {badge}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-[36px] font-bold tracking-tight sm:text-[42px] lg:text-[48px]"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-[16px] font-medium leading-8 text-white/60"
          >
            {subheading}
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.map((item: any, idx: number) => {
            const Icon = iconMap[item.props?.icon || item.icon] || Sparkles;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-8 transition-all hover:bg-white/[0.06] hover:border-white/20"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 transition-transform duration-500 group-hover:scale-110">
                  <Icon className="text-secondary" size={28} />
                </div>
                <h3 className="text-[20px] font-bold tracking-tight text-white">
                  {item.props?.title?.[lang] ||
                    item.props?.title?.en ||
                    item.props?.title ||
                    item.title?.[lang] ||
                    item.title?.en ||
                    item.title ||
                    ""}
                </h3>
                <p className="mt-4 text-[14px] font-medium leading-7 text-white/50">
                  {item.props?.description?.[lang] ||
                    item.props?.description?.en ||
                    item.props?.description ||
                    item.desc?.[lang] ||
                    item.desc?.en ||
                    item.desc ||
                    ""}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Difference;
