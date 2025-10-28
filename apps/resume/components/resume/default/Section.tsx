import clsx from "clsx";
import React from "react";
import styles from './Section.module.css'
type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
  printPageBreakAfter?: boolean;
  printPageBreakBefore?: boolean;
};

export function Section({ title, children, className, printPageBreakAfter,printPageBreakBefore }: Props) {
  return (
    <div className={clsx(className, styles.section, 
    printPageBreakAfter && styles.pageBreakAfter,
    printPageBreakBefore && styles.pageBreakBefore
    )}>
      <header>
            <h2>{title}</h2>
      </header>
      {children}
    </div>
  );
}
