"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  password: z.string().min(1, "Enter the admin password."),
});

type LoginValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        toast.error("Incorrect admin password.");
        return;
      }

      toast.success("Access granted.");
      router.push("/admin");
      router.refresh();
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="password">Admin password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your admin password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-300">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full rounded-2xl" disabled={isPending}>
        <LockKeyhole className="size-4" />
        {isPending ? "Checking access" : "Enter dashboard"}
      </Button>

      <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck className="size-4" />
          Protected admin access
        </div>
        <p className="mt-2 leading-6">
          This dashboard is protected by the `ADMIN_PASSWORD` value in `.env.local`
          and a signed session cookie.
        </p>
      </div>
    </form>
  );
}
