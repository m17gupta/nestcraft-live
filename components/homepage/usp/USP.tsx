"use client";
import { RefreshCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { defaultUSPItems } from "./uspData";

const USP = () => {
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const pathname = usePathname();

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const getCurrentSection = useMemo(() => {
    if (!currentPages) return;
    return currentPages.content?.find((page: any) => page?.adminTitle === "USP Section");
  }, [currentPages]);


  const items = (getCurrentSection as any)?.content || defaultUSPItems;

  

  const iconMap: Record<string, any> = {
    "truck": Truck,
    "shield-check": ShieldCheck,
    "refresh-ccw": RefreshCcw,
    "sparkles": Sparkles
  };

  const icons = [Truck, ShieldCheck, RefreshCcw, Sparkles];

  return (
    <section
      data-annotate-id="home-usp-section"
      className="px-[5%] pb-[90px] mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-border md:shadow-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] p-[22px] rounded-lg"
      >
        {items.map((item: any, idx: number) => {
          const sp = item.props || {};
          const getV = (field: any) => {
            if (!field) return "";
            const val = field.value !== undefined ? field.value : field;
            if (val && typeof val === "object") return val[lang] || val.en || "";
            return val || "";
          };

          const iconKey = getV(sp.icon);
          const Icon = iconMap[iconKey] || icons[idx % icons.length];
          const title = getV(sp.title) || item.title;
          const description = getV(sp.description) || item.description || item.sub;
          
          return (
            <div key={idx} className="flex gap-3 items-start p-[6px_8px]">
              <Icon className="text-secondary mt-0.5" size={22} />
              <div>
                <strong className="block text-[12px] tracking-[2px] uppercase font-black">
                  {title}
                </strong>
                <span className="block text-[12px] text-muted mt-0.5 font-bold">
                  {description}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default USP;