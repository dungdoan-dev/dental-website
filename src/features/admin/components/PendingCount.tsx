"use client";

import { Suspense, use, type ReactNode } from "react";

function Resolved({ promise, children }: { promise: Promise<number>; children: (count: number) => ReactNode }) {
  return <>{children(use(promise))}</>;
}

// The layout starts the count query without awaiting it; the page streams first and the badge fills in when it resolves.
export function PendingCount({ promise, children }: { promise: Promise<number>; children: (count: number) => ReactNode }) {
  return <Suspense fallback={children(0)}><Resolved promise={promise}>{children}</Resolved></Suspense>;
}
