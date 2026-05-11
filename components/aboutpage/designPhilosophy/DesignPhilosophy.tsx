"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { defaultDesignPhilosophyData } from "./designPhilosophyData";

const DesignPhilosophy = () => {
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
    return currentPages.content?.find((s: any) => s?.adminTitle === "Design Philosophy");
  }, [currentPages]);


  // 3. Data Merging
  const p = (section as any)?.props || defaultDesignPhilosophyData.props;
  const content = (section as any)?.content || defaultDesignPhilosophyData.content;
  const tags = (section as any)?.tags || defaultDesignPhilosophyData.tags;

  // Localized values
  const badge = p.badge?.[lang] || p.badge?.en || p.badge || "";
  const heading = p.heading?.[lang] || p.heading?.en || p.heading || "";

  return (
    <section
      data-annotate-id="about-materials-section"
      className="bg-[#f7f4ef] text-[#1a1a1a]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-[5%] py-24 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Images Column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2"
        >
          {content.map((item: any, idx: number) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-[32px] border border-[#e4ddd3] shadow-xl ${
                idx === 0 ? "sm:translate-y-12" : ""
              }`}
            >
              <img
                src={item.props?.image || item.image}
                alt={
                  item.props?.alt?.[lang] ||
                  item.props?.alt?.en ||
                  item.props?.alt ||
                  item.alt?.[lang] ||
                  item.alt?.en ||
                  item.alt ||
                  ""
                }
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </motion.div>

        {/* Content Column */}
        <motion.div
          initial={{ opacity: 0, x: 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-[12px] font-black uppercase tracking-[3px] text-secondary">
            {badge}
          </p>
          <h2 className="font-heading text-[34px] font-bold leading-tight tracking-tight text-[#1a1a1a] sm:text-[42px] lg:text-[48px]">
            {heading}
          </h2>
          
          <div className="mt-8 space-y-6">
            {p.paragraphs?.map((para: any, idx: number) => (
              <p
                key={idx}
                className="text-[16px] font-medium leading-8 text-[#5a5550] sm:text-[17px]"
              >
                {para?.[lang] || para?.en || para || ""}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {tags.map((tag: any, idx: number) => (
              <span
                key={idx}
                className="inline-flex rounded-full border border-[#ddd5ca] bg-white px-5 py-2.5 text-[13px] font-bold text-[#4c443d] transition-colors hover:border-secondary/30 hover:bg-secondary/5"
              >
                {tag?.[lang] || tag?.en || tag || ""}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DesignPhilosophy;
