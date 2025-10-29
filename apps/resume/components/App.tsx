'use client'
import React from "react";
import { Drawer, DrawerContent, DrawerMain } from "./Drawer";
import DrawerContents from "./Drawer/DrawerContents";
import { Resume } from "@/lib/resume";

import { ReactNode } from "react";

interface AppProps {
  visualStyle?: string;
  resume: Resume;
  children?: ReactNode;
  lang: string;
  token?: string;
}

const App: React.FC<AppProps> = ({resume, children, lang, token  }) => {
  return (
    <div className="bg-sidebar min-h-screen overflow-clip">
      <Drawer >
        <div
          className="lg:flex flex-1"
          style={{ perspective: "1200px" }}
        >
          <DrawerContent>
            <DrawerContents resume={resume} lang={lang} token={token} />
          </DrawerContent>
          <DrawerMain>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
          </DrawerMain>
        </div>
      </Drawer>
    </div>
  );
};

export default App;