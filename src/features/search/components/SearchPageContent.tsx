import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { searchWebsite } from "../services/search.service";

type SearchPageContentProps = { query: string };

export async function SearchPageContent({ query }: SearchPageContentProps) {
  const searchQuery = query.trim().slice(0, 80);
  const results = await searchWebsite(searchQuery);

  return (
    <section className="bg-surface py-14 md:py-20">
      <div className="mx-auto max-w-5xl px-margin-mobile md:px-margin">
        <h1 className="text-3xl font-extrabold text-text-primary md:text-4xl">Tìm kiếm</h1>
        <p className="mt-3 text-text-secondary">Tìm dịch vụ, bác sĩ và bài viết tại Nha Khoa 2000.</p>
        <form action="/tim-kiem" className="mt-8 flex max-w-2xl gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-border-subtle" method="get" role="search">
          <label className="sr-only" htmlFor="site-search-input">Từ khóa tìm kiếm</label>
          <input autoFocus className="min-w-0 flex-1 px-3 text-sm text-text-primary outline-none" defaultValue={searchQuery} id="site-search-input" maxLength={80} name="q" placeholder="Nhập từ khóa cần tìm..." required type="search" />
          <button className="flex items-center gap-2 rounded-xl bg-brand-blue-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-[#056697]" type="submit"><Icon className="h-4 w-4" name="search" />Tìm</button>
        </form>

        {!searchQuery ? (
          <p className="mt-10 rounded-2xl bg-white p-6 text-text-secondary">Nhập từ khóa để bắt đầu tìm kiếm.</p>
        ) : results.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-6 text-text-secondary">Không tìm thấy kết quả cho “{searchQuery}”. Hãy thử từ khóa khác.</p>
        ) : (
          <div className="mt-10">
            <p aria-live="polite" className="text-sm font-semibold text-text-secondary">Tìm thấy {results.length} kết quả cho “{searchQuery}”</p>
            <ul className="mt-5 grid gap-4">
              {results.map((result) => (
                <li key={`${result.type}-${result.id}`}>
                  <Link className="block rounded-2xl border border-border-subtle bg-white p-6 transition hover:border-brand-blue hover:shadow-md" href={result.href}>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-blue-dark">{result.type}</span>
                    <h2 className="mt-2 text-lg font-bold text-text-primary">{result.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{result.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
