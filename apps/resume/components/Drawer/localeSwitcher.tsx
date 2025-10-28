'use client';
import { useTranslation } from "@/i18n/provider";
import React from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useQueryState } from "nuqs";

const LocaleButton = ({
  locale: buttonLocale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useQueryState("lang", { shallow: false, defaultValue: 'fr', });
  
  const isActive = buttonLocale === lang;

  return (
    <Button
      className="relative flex-1 p-2"
      variant="ghost"
      onClick={() => setLang(buttonLocale)}
    >
      <span className={`relative z-10 transition-colors ${isActive ? 'text-primary-foreground' : ''}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="locale-active-pill"
          className="absolute inset-0 bg-primary"
          style={{ borderRadius: 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Button>
  );
};

export default function LocaleSwitcher() {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="px-1 text-sm font-semibold mb-2">{t("Drawer.language")}</h3>
      <div className="flex items-center space-x-2 p-1 bg-card rounded-lg">
        <LocaleButton locale="fr">FR</LocaleButton>
        <LocaleButton locale="en">EN </LocaleButton>
      </div>
    </div>
  );
}