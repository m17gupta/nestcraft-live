"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { defaultStatsSectionData } from "./statsSectionData";

const StatsSection = () => {
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
    return currentPages.content?.find((s: any) => s?.adminTitle === "Stats Section");
  }, [currentPages]);
  // 3. Data Merging
  const p = (section as any)?.props || defaultStatsSectionData.props;
  const content = (section as any)?.content || defaultStatsSectionData.content;

  const sectionPadding = p.sectionPadding || defaultStatsSectionData.props.sectionPadding;

  return (
    <section 
      data-annotate-id="stats-section"
      className={`bg-white ${sectionPadding} px-[5%]`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.map((item: any, idx: number) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center py-10 px-6 rounded-[24px] border border-gray-100 bg-white transition-all hover:shadow-lg hover:shadow-gray-100/50"
            >
              <span className="text-4xl md:text-5xl font-bold text-black mb-3 font-heading">
                {item.props?.value || item.value}
              </span>
              <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[2px] text-gray-500 text-center">
                {item.props?.label?.[lang] ||
                  item.props?.label?.en ||
                  item.props?.label ||
                  item.label?.[lang] ||
                  item.label?.en ||
                  item.label ||
                  ""}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
