import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/admin-ui/button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { requireAdmin } from "@/features/admin/auth/admin-auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { FaqFormDialog } from "@/features/admin/components/FaqFormDialog";
import { DeleteFaqButton } from "@/features/admin/components/DeleteButtons";

export const metadata = {
  title: "Quản Lý Hỏi Đáp | Admin Nha Khoa 2000",
};

export default async function AdminFaqPage() {
  await requireAdmin();
  const { data, error } = await (await getSupabaseServerClient()).from("faq_items").select("*").order("sort_order").order("id");
  if (error) throw error;
  const faqRows = data ?? [];
  // New questions go last instead of jumping to the top at sort_order 0.
  const categories = [...new Set(faqRows.map((row) => row.category))];
  const nextFaqSort = faqRows.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1;

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        actions={<Button asChild size="sm" variant="soft"><Link prefetch={false} href="/hoi-dap" rel="noreferrer" target="_blank"><ExternalLink /> Xem trang Hỏi đáp</Link></Button>}
        description="Câu hỏi hiển thị ở trang Hỏi đáp và mục FAQ trang chủ; thứ tự theo số thứ tự. Tiêu đề mục chỉnh trong Nội dung trang chủ."
        title="Câu hỏi thường gặp"
      />
      <section className="overflow-hidden rounded-[7px] bg-card shadow-card">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-base font-bold text-text-primary">Câu hỏi thường gặp (FAQ)</h2>
            <p className="text-xs text-text-secondary">Thêm, sửa hoặc xóa câu hỏi và câu trả lời.</p>
          </div>
          <FaqFormDialog
            categories={categories}
            nextSortOrder={nextFaqSort}
            buttonLabel="+ Thêm Câu Hỏi"
            buttonClassName={buttonVariants({ size: "sm" })}
          />
        </div>

        <div className="divide-y divide-slate-100">
          {faqRows.map((faq) => (
            <div key={faq.id} className="flex items-start justify-between gap-4 p-5 hover:bg-background-secondary transition">
              <div className="min-w-0 space-y-1.5">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-light text-[11px] font-bold text-brand-blue-dark">
                    ?
                  </span>
                  {faq.question}
                  <span className="rounded-full bg-background-secondary px-2 py-0.5 text-[11px] font-semibold text-text-secondary">{faq.category}</span>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed pl-7">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <FaqFormDialog
                  categories={categories}
                  faq={{ ...faq, id: faq.id.toString() }}
                  buttonLabel="Sửa"
                  buttonClassName={buttonVariants({ variant: "soft", size: "sm" })}
                />
                <DeleteFaqButton id={faq.id.toString()} name={faq.question} />
              </div>
            </div>
          ))}
          {faqRows.length === 0 ? <p className="p-6 text-sm text-text-secondary">Chưa có câu hỏi nào.</p> : null}
        </div>
      </section>

    </div>
  );
}
