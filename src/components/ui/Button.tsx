import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
};

const buttonClassName = "inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";

export function Button({ children, className = "", ...props }: ButtonProps) {
  return <button className={`${buttonClassName} ${className}`} {...props}>{children}</button>;
}

export function ButtonLink({ children, href, className = "" }: ButtonLinkProps) {
  return <Link className={`${buttonClassName} ${className}`} href={href}>{children}</Link>;
}
