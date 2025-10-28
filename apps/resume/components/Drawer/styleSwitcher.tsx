"use client";
import { useTranslation } from "@/i18n/provider";
import React from "react";
import {
  ViewColumnsIcon,
  SparklesIcon,
  DocumentTextIcon,
  PrinterIcon,
  CodeBracketIcon,
} from "./icons";
import { Button } from "../ui/button";
import { useQueryState } from "nuqs";
import { motion } from "framer-motion";

const VisualStyleButton = ({
  visualStyle: buttonVisualStyle,
  children,
}: {
  visualStyle: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const [visualStyle, setStyle] = useQueryState("style", { shallow: false });
  const isActive = (visualStyle || "default") === buttonVisualStyle;

  return (
    <Button
      className="relative flex-1 p-2"
      onClick={() => setStyle(buttonVisualStyle)}
      aria-label={t(`Drawer.${buttonVisualStyle}`)}
      variant="ghost"
    >
      <span
        className={`relative z-10 transition-colors flex items-center ${
          isActive ? "text-primary-foreground" : ""
        }`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="style-active-pill"
          className="absolute inset-0 bg-primary"
          style={{ borderRadius: 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Button>
  );
};

export default function VisualStyleSwitcher() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="px-1 text-sm font-semibold  mb-2">{t("Drawer.style")}</h3>
      <div className="grid grid-cols-2 gap-2 bg-card p-1 rounded-lg">
        <VisualStyleButton visualStyle="default">
          <ViewColumnsIcon className="w-5 h-5 mr-2" /> {t("Drawer.default")}
        </VisualStyleButton>
        <VisualStyleButton visualStyle="modern">
          <SparklesIcon className="w-5 h-5 mr-2" /> {t("Drawer.modern")}
        </VisualStyleButton>
        <VisualStyleButton visualStyle="terminal">
          <CodeBracketIcon className="w-5 h-5 mr-2" /> {t("Drawer.terminal")}
        </VisualStyleButton>
        <VisualStyleButton visualStyle="simple">
          <PrinterIcon className="w-5 h-5 mr-2" /> {t("Drawer.simple")}
        </VisualStyleButton>
      </div>
    </div>
  );
}