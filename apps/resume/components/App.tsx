'use client'
import React from "react";
import { Drawer, DrawerContent, DrawerMain } from "./Drawer";
import Header from "./Drawer/Header";
import DrawerContents from "./Drawer/DrawerContents";
import Resumee3D from "./resume/3d";
import ResumeDefault from "./resume/default";
import { useQueryState } from "nuqs";
import { Resume } from "@/lib/resume";
import ResumeModern from "./resume/modern";
import ResumeSimple from "./resume/Simple";

import { ReactNode } from "react";

interface AppProps {
  visualStyle?: string;
  resume: Resume;
  children?: ReactNode;
  lang: string;
  token?: string;
}

const App: React.FC<AppProps> = ({resume, children, lang, token  }) => {
  const [visualStyle] = useQueryState('style')
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