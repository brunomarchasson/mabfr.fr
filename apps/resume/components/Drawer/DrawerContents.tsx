"use client";

import React from "react";
import {
  XIcon,
  PaintBrushIcon,
  CogIcon,
  DownloadIcon
} from "./icons";
import { useTranslation } from "@/i18n/provider";
import ThemeSwitcher from "./themeSwitcher";
import LocaleSwitcher from "./localeSwitcher";
import PrivacyInput from "./privacyInput";
import { useDrawer } from ".";
import DownloadRemsume from "./download";
import VisualStyleSwitcher from "./styleSwitcher";
import { Button } from "../ui/button";
import { Resume } from "@/lib/resume";

export type VisualStyle = "default" | "modern" | "paper" | "print";

const Section: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
    <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2 px-1">
            {icon}
            {title}
        </h3>
        <div className="space-y-2 rounded-lg bg-muted/50 p-2">
            {children}
        </div>
    </div>
);

const DrawerContents: React.FC<{ resume: Resume, lang: string, token?: string }> = ({
  resume,
  lang,
  token
}) => {
  const { state: drawerState, closeDrawer } = useDrawer();
  const { t } = useTranslation();
  
  return (
    <>
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <Section title="Appearance" icon={<PaintBrushIcon className="w-4 h-4"/>}>
              <ThemeSwitcher />
              <VisualStyleSwitcher />
          </Section>
          <Section title="Settings" icon={<CogIcon className="w-4 h-4"/>}>
            <LocaleSwitcher />
            <PrivacyInput isUnlocked = {resume.hasAccess}/>
          </Section>
          <Section title={t("Drawer.downloads")} icon={<DownloadIcon className="w-4 h-4"/>}>
            <DownloadRemsume resume={resume} lang={lang} token={token} />
          </Section>
        </div>
      </div>

      <div className="p-4 border-t ">
        <p className="text-xs text-center text-muted-foreground">
          {t("Drawer.copyright")}
        </p>
      </div>
    </>
  );
};

export default DrawerContents;