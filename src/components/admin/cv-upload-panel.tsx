"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CvUploadPanelProps = {
  label: string;
  onLabelChange: (value: string) => void;
  initialFileName: string;
  initialEnabled: boolean;
  initialHasFile: boolean;
};

export function CvUploadPanel({
  initialEnabled,
  initialFileName,
  initialHasFile,
  label,
  onLabelChange,
}: CvUploadPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState(initialFileName);
  const [hasFile, setHasFile] = useState(initialHasFile);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isUploading, startUploading] = useTransition();
  const [isRemoving, startRemoving] = useTransition();

  const uploadCv = () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      toast.error("Choose a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("label", label);

    startUploading(async () => {
      const response = await fetch("/api/admin/cv", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        error?: string;
        fileName?: string;
        label?: string;
      };

      if (!response.ok) {
        toast.error(payload.error ?? "Unable to upload CV.");
        return;
      }

      setFileName(payload.fileName ?? file.name);
      setHasFile(true);
      setEnabled(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("CV uploaded.");
      router.refresh();
    });
  };

  const removeCv = () => {
    startRemoving(async () => {
      const response = await fetch("/api/admin/cv", { method: "DELETE" });

      if (!response.ok) {
        toast.error("Unable to remove CV.");
        return;
      }

      setFileName("");
      setHasFile(false);
      setEnabled(false);
      toast.success("CV removed.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/[0.08] bg-black/[0.12] p-4">
        <div className="flex items-start gap-3">
          <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/[0.12] bg-white/[0.06]">
            <FileText className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Current CV</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasFile && enabled
                ? `${fileName} is available for download on the home page.`
                : "No CV uploaded yet. Visitors will not see a download button."}
            </p>
            {hasFile && enabled ? (
              <a
                href="/api/cv"
                className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Download className="size-4" />
                Preview download
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cv-label">Button label</Label>
        <Input
          id="cv-label"
          value={label}
          onChange={(event) => onLabelChange(event.target.value)}
          placeholder="Download CV"
        />
        <p className="text-xs text-muted-foreground">
          Use &quot;Save changes&quot; at the top to update the button label without re-uploading.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cv-file">PDF file</Label>
        <Input
          id="cv-file"
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/[0.12]"
        />
        <p className="text-xs text-muted-foreground">PDF only, up to 10 MB.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={uploadCv}
          className="rounded-full"
          disabled={isUploading}
        >
          <Upload className="size-4" />
          {isUploading ? "Uploading..." : hasFile ? "Replace CV" : "Upload CV"}
        </Button>
        {hasFile ? (
          <Button
            type="button"
            variant="outline"
            onClick={removeCv}
            className="rounded-full border-white/[0.12] bg-transparent text-white hover:bg-white/[0.08]"
            disabled={isRemoving}
          >
            <Trash2 className="size-4" />
            {isRemoving ? "Removing..." : "Remove CV"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
