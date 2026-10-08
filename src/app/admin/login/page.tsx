import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";
import { hasAdminSession } from "@/features/admin/auth/admin-auth";

export const metadata: Metadata = { title: "Đăng nhập quản trị | Nha Khoa 2000", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await hasAdminSession()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <Image alt="Nha Khoa 2000" className="h-auto w-36" height={48} priority src="/images/logo/nha-khoa-2000.png" width={144} />
        <h1 className="mt-8 text-2xl font-bold text-slate-900">Đăng nhập quản trị</h1>
        <p className="mt-2 text-sm text-slate-500">Dành cho người quản lý website Nha Khoa 2000.</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
