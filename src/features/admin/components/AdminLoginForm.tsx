"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "../auth/actions";

const initialState: LoginState = { error: "" };

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-username">
        Tên đăng nhập
        <input autoComplete="username" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" id="admin-username" maxLength={100} name="username" required type="text" />
      </label>
      <label className="block text-sm font-semibold text-slate-700" htmlFor="admin-password">
        Mật khẩu
        <input autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" id="admin-password" name="password" required type="password" />
      </label>
      {state.error ? <p aria-live="polite" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{state.error}</p> : null}
      <button className="w-full rounded-xl bg-brand-blue-dark px-5 py-3 font-bold text-white transition hover:bg-brand-blue disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
