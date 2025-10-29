import style from './Basics.module.css'
import React from "react";
import { Resume } from '@/lib/resume';


export const Basics = async ({ resume }: { resume: Resume }) => {
  const { resumeData } = resume;
  const { label, summary } = resumeData?.basics ?? {};
  return (
    <header className={style.header}>
      <h1>{label}</h1>
      {summary}
    </header>
  );
};

