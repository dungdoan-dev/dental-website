import type { MutationResult } from "../services/mutation";

export function FormFeedback({ result }: { result: MutationResult | null }) {
  if (!result) return null;
  if (result.success) return <p aria-live="polite" className="rounded-lg bg-brand-green-light p-3 text-sm text-text-primary">Đã lưu thay đổi.</p>;
  return <div className="rounded-lg border border-error/20 bg-error-container/30 p-3 text-sm text-error" role="alert">
    <p>{result.error}</p>
    {result.fieldErrors && <ul className="mt-2 list-inside list-disc">{Object.entries(result.fieldErrors).map(([field, message]) => <li key={field}>{field}: {message}</li>)}</ul>}
  </div>;
}
