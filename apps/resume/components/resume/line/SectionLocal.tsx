
import React from 'react';

interface SectionLocalProps {
  title: string;
  pathLocal: string;
  children?: React.ReactNode;
}

export default function SectionLocal({ title, pathLocal, children }: SectionLocalProps) {
  return (
    <section className="cv-section relative flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 gap-6 bg-transparent z-20">
      <h2 className="text-3xl font-semibold mb-4 z-10 relative">{title}</h2>
      <div className="z-10 relative max-w-3xl text-center">
        {children}
      </div>

      {/* The local path for this section, to be combined by the global path builder */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: 0 }}>
        <path className="cv-path-segment" d={pathLocal} stroke="black" strokeWidth={1} fill="none" />
      </svg>
    </section>
  );
}
