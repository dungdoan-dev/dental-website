import { notFound } from "next/navigation";

// Routes unmatched URLs through (public)/not-found.tsx so the 404 keeps the site header and footer.
export default function CatchAllNotFound() {
  notFound();
}
