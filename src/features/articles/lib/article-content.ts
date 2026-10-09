import sanitizeHtml from "sanitize-html";

export type ArticleHeading = { id: string; text: string; level: 2 | 3 };

export function slugifyArticleHeading(value: string) {
  return value.toLocaleLowerCase("vi-VN").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "muc-noi-dung";
}

export function isRichArticleHtml(content: string) {
  return /<(?:p|h[1-6]|ul|ol|li|blockquote|table|strong|em|div|br|hr)\b/i.test(content);
}

function isAllowedArticleImage(source?: string) {
  if (!source) return false;
  if (source.startsWith("/") && !source.startsWith("//")) return true;
  try {
    const imageUrl = new URL(source);
    const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(storageUrl && imageUrl.origin === new URL(storageUrl).origin && imageUrl.pathname.startsWith("/storage/v1/object/public/site-media/"));
  } catch {
    return false;
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

export function sanitizeArticleHtml(content: string) {
  const html = sanitizeHtml(content, {
    allowedTags: ["p", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "sub", "sup", "code", "pre", "ul", "ol", "li", "blockquote", "a", "img", "br", "hr", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height", "loading"], th: ["colspan", "rowspan"], td: ["colspan", "rowspan"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          rel: "noopener noreferrer",
          ...(attributes.target === "_blank" ? { target: "_blank" } : {}),
        },
      }),
      img: (_tagName, attributes) => isAllowedArticleImage(attributes.src)
        ? { tagName: "img", attribs: { src: attributes.src!, alt: attributes.alt ?? "", loading: "lazy" } as Record<string, string> }
        : { tagName: "span", attribs: { alt: "" } as Record<string, string> },
    },
  });

  const usedIds = new Map<string, number>();
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/gi, (_match, level: string, inner: string) => {
    const text = decodeHtmlEntities(inner.replace(/<[^>]*>/g, "")).trim();
    const baseId = slugifyArticleHeading(text);
    const count = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, count);
    const id = count === 1 ? baseId : `${baseId}-${count}`;
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
}

export function getRichArticleHeadings(content: string): ArticleHeading[] {
  return [...sanitizeArticleHtml(content).matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    id: match[2],
    text: decodeHtmlEntities(match[3].replace(/<[^>]*>/g, "")).trim(),
    level: Number(match[1]) as 2 | 3,
  }));
}

export function sanitizeArticleContent(content: string) {
  return isRichArticleHtml(content) ? sanitizeArticleHtml(content) : content;
}
