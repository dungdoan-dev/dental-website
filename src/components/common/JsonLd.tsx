// Structured data for Google (schema.org). `<` is escaped so content can never close the script tag.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} type="application/ld+json" />;
}
