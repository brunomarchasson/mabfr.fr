import { useTranslation } from "@/i18n/provider";
import React from "react";
import { Button } from "../ui/button";
import { CodeBracketIcon, DocumentTextIcon } from "./icons";
import { Resume } from "@/lib/resume";

const DownloadButton: React.FC<{
  format: string;
  icon: React.ReactElement<{ className?: string }>;
  onClick: () => void;
  "aria-label": string;
}> = ({ format, icon, onClick, "aria-label": ariaLabel }) => (
  <Button
    onClick={onClick}
    variant="default"
    className="h-auto flex flex-col items-center justify-center aspect-square"
    aria-label={ariaLabel}
  >
    {React.cloneElement(icon, {
      className:
        "w-7 h-7 mb-1.5 transition-transform duration-300 group-hover:scale-110",
    })}
    {format}
  </Button>
);

export default function DownloadRemsume({ resume, lang, token }: { resume: Resume, lang: string, token?: string }) {
  const { t } = useTranslation();
  const { resumeData } = resume;

  const handleDownload = async (format: 'pdf' | 'html' | 'json') => {
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, locale: lang, token }),
      });

      if (!response.ok) {
        throw new Error(`Failed to download ${format.toUpperCase()}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error(`Generated ${format.toUpperCase()} is empty`);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData?.basics?.name?.replace(/\s+/g, "_") || "resume"}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(`Error downloading ${format.toUpperCase()}:`, error);
      alert(`Could not download ${format.toUpperCase()}. See console for details.`);
    }
  };

  return (
    <div>

      <div className="grid grid-cols-3 gap-2">
        <DownloadButton
          format="PDF"
          icon={<DocumentTextIcon />}
          onClick={() => handleDownload('pdf')}
          aria-label={t("Drawer.downloadPDF")}
        />
        <DownloadButton
          format="HTML"
          icon={<CodeBracketIcon />}
          onClick={() => handleDownload('html')}
          aria-label={t("Drawer.downloadHTML")}
        />
        <DownloadButton
          format="JSON"
          icon={<CodeBracketIcon />}
          onClick={() => handleDownload('json')}
          aria-label={t("Drawer.downloadJSON")}
        />
      </div>
    </div>
  );
}