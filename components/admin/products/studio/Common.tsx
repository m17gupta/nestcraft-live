export function SectionCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl italic">
      <div className="flex items-center gap-5 mb-10 pb-8 border-b border-slate-50">
        <div className="h-12 w-12 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-center text-primary shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none mb-2">
            Management Module
          </span>
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em] leading-none">
            {title}
          </h3>
        </div>
      </div>
      {children}
    </div>
  );
}
