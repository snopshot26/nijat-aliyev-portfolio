"use client";

import { Toaster } from "sonner";

export function SonnerToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand={false}
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "!border-white/[0.12] !bg-[#0d1124]/95 !text-white !shadow-[0_24px_80px_-32px_rgba(0,0,0,0.7)]",
        },
      }}
    />
  );
}
