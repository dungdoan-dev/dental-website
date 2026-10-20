"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { createContext, useContext, useState, type ReactNode } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

const sizes = { md: "max-w-2xl", lg: "max-w-3xl", xl: "max-w-4xl" } as const;

// Cancel buttons inside a dialog call this so they get the same unsaved-changes check as the X button and Esc.
const CloseContext = createContext<(() => void) | null>(null);
export const useAdminDialogClose = () => useContext(CloseContext);

// Shared modal shell for the admin edit forms. Radix provides focus trap, Esc, scroll lock and ARIA.
// Clicking the backdrop does not close it: a stray click must not discard a long form.
// shortcut: "dirty" means the admin typed or changed a field (input/change events); programmatic changes
// such as an uploaded image or an added row do not count. Upgrade if those need the warning too.
export function AdminDialog({ open, onOpenChange, title, icon, eyebrow, size = "lg", children }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  icon?: string;
  eyebrow?: string;
  size?: keyof typeof sizes;
  children: ReactNode;
}) {
  const [dirty, setDirty] = useState(false);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  // Reset on close while rendering (React-recommended instead of an effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setDirty(false);
  }

  function requestClose() {
    if (dirty) setConfirmingDiscard(true);
    else onOpenChange(false);
  }

  return (
    <Dialog.Root onOpenChange={(next) => { if (next) onOpenChange(true); else requestClose(); }} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="admin-dialog-overlay fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
          <Dialog.Content aria-describedby={undefined} className={`admin-dialog-panel mx-auto flex max-h-[calc(100dvh-1.5rem)] w-full ${sizes[size]} flex-col overflow-hidden rounded-3xl border border-border-subtle bg-white shadow-2xl outline-none sm:my-2 sm:max-h-[calc(100dvh-3rem)]`} onChangeCapture={() => setDirty(true)} onInputCapture={() => setDirty(true)} onInteractOutside={(event) => event.preventDefault()}>
            <header className="admin-dialog-header flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle/60 px-5 pb-4 pt-5 text-left sm:px-7 sm:pt-6">
              <div className="flex min-w-0 items-center gap-3">
                {icon ? <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-blue-light text-brand-blue-dark"><span className="material-symbols-outlined text-[22px]">{icon}</span></span> : null}
                <div className="min-w-0">
                  {eyebrow ? <p className="text-[11px] font-bold uppercase tracking-wider text-brand-blue-dark">{eyebrow}</p> : null}
                  <Dialog.Title className="truncate text-lg font-bold text-text-primary">{title}</Dialog.Title>
                </div>
              </div>
              <Dialog.Close aria-label="Đóng" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text-secondary transition hover:bg-surface-container hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand-blue">
                <span aria-hidden="true" className="material-symbols-outlined text-[20px]">close</span>
              </Dialog.Close>
            </header>
            <CloseContext.Provider value={requestClose}>{children}</CloseContext.Provider>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
      <ConfirmDialog confirmLabel="Bỏ thay đổi" description="Các thay đổi bạn vừa nhập chưa được lưu và sẽ bị mất." onConfirm={() => onOpenChange(false)} onOpenChange={setConfirmingDiscard} open={confirmingDiscard} title="Đóng mà không lưu?" cancelLabel="Tiếp tục chỉnh sửa" />
    </Dialog.Root>
  );
}
