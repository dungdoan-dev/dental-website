import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { JsonLd } from "@/components/common/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { AboutPageHead } from "@/features/about/components/AboutShared";
import { getFaqItems } from "@/features/home/services/home.service";
import { slugifyArticleHeading } from "@/features/articles/lib/article-content";
import { generateSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSeoMetadata({
  title: "Câu hỏi thường gặp",
  description: "Những thắc mắc thường gặp về đặt lịch, thăm khám, bảo hiểm và thông tin cơ sở Nha Khoa 2000.",
  url: "/gioi-thieu/cau-hoi-thuong-gap",
});

export default async function AboutFaqPage() {
  const all = await getFaqItems();
  // Questions ticked "Trang Giới thiệu" in /admin/faq, grouped by their topic.
  const items = all.filter((item) => item.showOnAbout);
  const groups = [...new Set(items.map((item) => item.category))].map((name) => ({ name, id: `faq-${slugifyArticleHeading(name)}`, items: items.filter((item) => item.category === name) }));

  return (
    <>
      {items.length > 0 && <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
      }} />}
      <AboutPageHead crumb="Câu hỏi thường gặp" lead="Những thắc mắc thường gặp về đặt lịch, thăm khám, bảo hiểm và thông tin cơ sở." title="Câu hỏi thường gặp" />
      <section className="pb-16 pt-8">
        <Container className="max-w-[960px]">
          {groups.length > 1 ? (
            <nav aria-label="Nhóm câu hỏi" className="flex flex-wrap gap-2">
              {groups.map((group) => <a className="inline-flex min-h-10 items-center rounded-full border border-border-subtle bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-brand-blue-dark hover:text-brand-blue-dark" href={`#${group.id}`} key={group.id}>{group.name}</a>)}
            </nav>
          ) : null}
          {groups.length === 0 ? <p className="rounded-md bg-background-secondary p-6 text-text-secondary">Câu hỏi đang được cập nhật. Quý khách có thể xem thêm tại trang <Link className="font-semibold text-brand-blue-dark underline" href="/hoi-dap">Hỏi đáp</Link>.</p> : null}
          {groups.map((group) => (
            <section aria-labelledby={`${group.id}-title`} className="mt-10 scroll-mt-44" id={group.id} key={group.id}>
              <h2 className="mb-4 text-xl font-extrabold text-brand-blue-dark" id={`${group.id}-title`}>{group.name}</h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details className="group rounded-md bg-surface" key={item.question}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-base font-bold text-text-primary transition hover:text-brand-blue sm:text-lg [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <Icon className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180" name="chevron-down" />
                    </summary>
                    <p className="whitespace-pre-line px-6 pb-5 text-sm leading-relaxed text-text-secondary sm:text-base">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </Container>
      </section>
    </>
  );
}
