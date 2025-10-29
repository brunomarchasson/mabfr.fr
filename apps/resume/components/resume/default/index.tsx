import React from "react";
import DefaultLayout from "./layout";
import { Resume } from "@/lib/resume";

type Props = {
  resume: Resume;
  locale: string;
};


function ResumeDefault({resume, locale}: Props) {
    // return ('Hello')
  return <div><DefaultLayout resume = {resume} locale={locale}/></div>
}

export default ResumeDefault;