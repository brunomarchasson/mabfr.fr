"use client";
import { useTranslation } from "@/i18n/provider";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "./icons";
import { Theme } from "../theme-provider";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const ThemeButton = ({
  theme: buttonTheme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isActive = buttonTheme === theme;

  return (
    <Button
      className="relative flex-1 p-2"
      onClick={() => setTheme(buttonTheme)}
      aria-label={t(`Drawer.${buttonTheme}`)}
      variant="ghost"
    >
      <span className={`relative z-10 transition-colors ${isActive ? 'text-primary-foreground' : ''}`}>
        {children}
      </span>
      {isActive && (
        <motion.div
          layoutId="theme-active-pill"
          className="absolute inset-0 bg-primary"
          style={{ borderRadius: 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Button>
  );
};

export default function ThemeSwitcher() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[40px] w-full" />;
  }

  return (
    <div>
      <h3 className="px-1 text-sm font-semibold t mb-2">{t("Drawer.theme")}</h3>
      <div className="flex items-center space-x-2 bg-card p-1 rounded-lg">
        <ThemeButton theme="light">
          <SunIcon className="w-5 h-5" />
        </ThemeButton>
        <ThemeButton theme="dark">
          <MoonIcon className="w-5 h-5" />
        </ThemeButton>
        <ThemeButton theme="system">
          <ComputerDesktopIcon className_="w-5 h-5" />
        </ThemeButton>
      </div>
    </div>
  );
}