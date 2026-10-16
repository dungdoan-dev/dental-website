export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Đang tải" className="mx-auto flex w-full max-w-[1440px] animate-pulse flex-col gap-6 px-4 py-8 sm:px-8 sm:py-10" role="status">
      <div className="h-8 w-72 rounded-xl bg-slate-200" />
      <div className="h-4 w-full max-w-xl rounded-lg bg-slate-200" />
      <div className="h-64 rounded-2xl bg-slate-200/70" />
      <div className="h-40 rounded-2xl bg-slate-200/70" />
    </div>
  );
}
