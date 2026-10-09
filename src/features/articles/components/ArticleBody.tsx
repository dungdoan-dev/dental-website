import Link from "next/link";
import { getRichArticleHeadings, isRichArticleHtml, sanitizeArticleHtml, slugifyArticleHeading, type ArticleHeading } from "../lib/article-content";

export type { ArticleHeading } from "../lib/article-content";

export function getArticleHeadings(content: string): ArticleHeading[] {
  if (isRichArticleHtml(content)) return getRichArticleHeadings(content);
  return content.replace(/\r\n?/g, "\n").split("\n").flatMap((line) => {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    return match ? [{ id: slugifyArticleHeading(match[2]), text: match[2], level: match[1].length as 2 | 3 }] : [];
  });
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return <>{parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong className="font-bold text-text-primary" key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={index}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code className="rounded bg-surface-container-low px-1.5 py-0.5 text-[0.9em] text-brand-blue-dark" key={index}>{part.slice(1, -1)}</code>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const href = link[2];
      if (href.startsWith("/") && !href.startsWith("//")) return <Link className="font-semibold text-brand-blue-dark underline underline-offset-2" href={href} key={index}>{link[1]}</Link>;
      try {
        const url = new URL(href);
        if (url.protocol === "https:" || url.protocol === "http:") return <a className="font-semibold text-brand-blue-dark underline underline-offset-2" href={url.toString()} key={index} rel="noreferrer" target="_blank">{link[1]}</a>;
      } catch { /* render untrusted links as plain text */ }
      return <span key={index}>{link[1]}</span>;
    }
    return <span key={index}>{part}</span>;
  })}</>;
}

export function ArticleBody({ content }: { content: string }) {
  if (isRichArticleHtml(content)) {
    return <div className="article-prose space-y-6 [&_p]:mb-5 [&_p]:leading-8 [&_p]:text-text-secondary [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-text-primary [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-text-primary [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:font-semibold [&_a]:text-brand-blue-dark [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-5 [&_blockquote]:italic [&_table]:my-5 [&_table]:min-w-full [&_td]:border [&_td]:border-border-subtle [&_td]:p-3 [&_th]:border [&_th]:border-border-subtle [&_th]:bg-brand-blue-light [&_th]:p-3 [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }} />;
  }
  const blocks = content.replace(/\r\n?/g, "\n").split(/\n\s*\n/).filter((block) => block.trim());
  return <div className="article-prose space-y-6">{blocks.map((block, index) => {
    const lines = block.trim().split("\n").map((line) => line.trim());
    if (lines.every((line) => /^[-*] /.test(line))) return <ul className="list-disc space-y-2 pl-6 marker:text-brand-blue-dark" key={index}>{lines.map((line, i) => <li className="pl-1" key={i}><InlineText text={line.slice(2)} /></li>)}</ul>;
    if (lines.every((line) => /^\d+\. /.test(line))) return <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-blue-dark" key={index}>{lines.map((line, i) => <li className="pl-1" key={i}><InlineText text={line.replace(/^\d+\. /, "")} /></li>)}</ol>;
    if (lines.every((line) => line.startsWith("> "))) return <blockquote className="border-l-4 border-brand-blue pl-5 text-lg font-semibold italic leading-relaxed text-text-primary" key={index}>{lines.map((line, i) => <p key={i}><InlineText text={line.slice(2)} /></p>)}</blockquote>;
    if (lines.length >= 2 && lines.every((line) => line.includes("|"))) {
      const rows = lines.filter((line) => !/^\|?\s*:?-{3,}/.test(line)).map((line) => line.replace(/^\|?|\|?$/g, "").split("|").map((cell) => cell.trim()));
      const [head, ...body] = rows;
      if (head?.length) return <div className="overflow-x-auto rounded-xl border border-border-subtle" key={index}><table className="min-w-full text-left text-sm"><thead className="bg-brand-blue-light text-text-primary"><tr>{head.map((cell, i) => <th className="px-4 py-3 font-bold" key={i}><InlineText text={cell} /></th>)}</tr></thead><tbody className="divide-y divide-border-subtle">{body.map((row, i) => <tr key={i}>{head.map((_, cellIndex) => <td className="px-4 py-3 text-text-secondary" key={cellIndex}><InlineText text={row[cellIndex] ?? ""} /></td>)}</tr>)}</tbody></table></div>;
    }
    return <div className="space-y-5" key={index}>{lines.map((line, lineIndex) => {
      const heading = /^(#{1,3})\s+(.+)$/.exec(line);
      if (heading) {
        const id = slugifyArticleHeading(heading[2]);
        if (heading[1].length === 1) return <h2 className="scroll-mt-28 pt-3 text-2xl font-extrabold leading-snug tracking-tight text-text-primary sm:text-3xl" id={id} key={lineIndex}><InlineText text={heading[2]} /></h2>;
        if (heading[1].length === 2) return <h2 className="scroll-mt-28 pt-3 text-xl font-bold leading-snug text-text-primary sm:text-2xl" id={id} key={lineIndex}><InlineText text={heading[2]} /></h2>;
        return <h3 className="scroll-mt-28 pt-2 text-lg font-bold leading-snug text-text-primary" id={id} key={lineIndex}><InlineText text={heading[2]} /></h3>;
      }
      if (/^---+$/.test(line)) return null;
      return line ? <p className="whitespace-pre-line leading-8 text-text-secondary" key={lineIndex}><InlineText text={line} /></p> : null;
    })}</div>;
  })}</div>;
}
