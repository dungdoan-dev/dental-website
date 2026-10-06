import Link from "next/link";

type AppointmentButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export function AppointmentButton({ children = "ĐẶT LỊCH HẸN", className = "" }: AppointmentButtonProps) {
  return <Link className={`inline-flex items-center justify-center rounded-full bg-brand-blue px-5 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition hover:bg-brand-blue-dark hover:shadow-md ${className}`} href="/lien-he">{children}</Link>;
}
