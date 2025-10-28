"use server";
import localFont from "next/font/local";
import "./style.css";
import styles from "./layout.module.css";
import type { JSONResume } from "@/types/resume";
import { Sidebar } from "./Sidebar";
import { Skills } from "./Skills";
import QRCode from "./QRCode";
import { Languages } from "./Languages";
import { Basics } from "./Basics";
import { Work } from "./Work";
import { Projects } from "./Projects";
import { Volunteer } from "./Volunteer";
import { Education } from "./Education";
import { Awards } from "./Awards";
import { Certificates } from "./Certificates";
import { Publications } from "./Publications";
import { Interests } from "./Interests";
import { References } from "./References";

import clsx from "clsx";
import {  Resume } from "@/lib/resume";

const myFont = localFont({
  src: [
    {
      path: "./fonts/Gill Sans Light.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Gill Sans.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Gill Sans Medium.otf",
      weight: "900",
      style: "normal",
    },
  ],
});
interface DefaultLayoutProps {
  resume: Resume;
  locale: string;
}

export default async function DefaultLayout({ resume, locale }: DefaultLayoutProps) {
  const { resumeData } = resume
  
  return (
    <main
      className={clsx(myFont.className, styles.resume)}
      data-testid="resume-content"
    >
      <Sidebar resume={resume}>
        {resumeData.skills && (
          <Skills
            skills={resumeData.skills}
            className={"section mt-4 hideMobile"}
            locale={locale}
          />
        )}
        {resumeData.languages && (
          <Languages 
            languages={resumeData.languages}
            className={"section mt-4 hideMobile"}
            locale={locale}
          />
        )}
        {resumeData.basics?.url && <QRCode value={resumeData.basics?.url} />}
      </Sidebar >
      {resumeData.basics && <Basics  resume={resume} />}
      {resumeData.work && <Work resume={resume} locale={locale} />}
      {resumeData.projects && <Projects  resume={resume} locale={locale} />}
      {resumeData.volunteer && <Volunteer resume={resume} locale={locale} />}
      {resumeData.education && <Education  resume={resume} locale={locale} />}
      {resumeData.awards && <Awards resume={resume} locale={locale} />}
      {resumeData.certificates && <Certificates resume={resume} locale={locale} />}
      {resumeData.publications && <Publications  resume={resume} locale={locale} />}
      {resumeData.interests && <Interests  resume={resume} locale={locale} />}
      {resumeData.references && <References  resume={resume} locale={locale} />}
    </main>
  );
}