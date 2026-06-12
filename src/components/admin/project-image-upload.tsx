"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImageUp, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProjectImageUploadProps = {
  slug: string;
  previewImage: string;
  onPreviewImageChange: (value: string) => void;
};

export function ProjectImageUpload({
  onPreviewImageChange,
  previewImage,
  slug,
}: ProjectImageUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUploading] = useTransition();

  const uploadImage = () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Choose an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("file", file);

    startUploading(async () => {
      try {
        const response = await fetch("/api/admin/project-image", {
          method: "POST",
          body: formData,
        });

        const raw = await response.text();
        let payload: { error?: string; previewImage?: string } = {};

        if (raw) {
          try {
            payload = JSON.parse(raw) as { error?: string; previewImage?: string };
          } catch {
            toast.error("Upload failed. Server returned an invalid response.");
            return;
          }
        }

        if (!response.ok) {
          toast.error(payload.error ?? "Unable to upload preview image.");
          return;
        }

        if (payload.previewImage) {
          onPreviewImageChange(payload.previewImage);
        }

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success("Demo preview uploaded.");
        router.refresh();
      } catch {
        toast.error("Upload failed. Check your connection and try again.");
      }
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
      <div>
        <p className="text-sm font-medium text-white">Demo preview image</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Upload a screenshot of the live demo. It appears in the project card carousel.
        </p>
      </div>

      {previewImage ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08]">
          <Image
            src={previewImage}
            alt="Project demo preview"
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.03] text-sm text-muted-foreground">
          <ImageUp className="mr-2 size-4" />
          No preview image yet
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`project-image-${slug}`}>Image file</Label>
        <Input
          id={`project-image-${slug}`}
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
          className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/[0.12]"
        />
      </div>

      <Button
        type="button"
        onClick={uploadImage}
        className="rounded-full"
        disabled={isUploading}
      >
        <Upload className="size-4" />
        {isUploading ? "Uploading..." : previewImage ? "Replace preview" : "Upload preview"}
      </Button>
    </div>
  );
}
