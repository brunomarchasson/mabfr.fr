import { useEffect, useRef } from "react";

interface CVSectionProps {
  title: string;
  children: React.ReactNode;
  pathD: string;
}

export default function CVSection({ title, children, pathD }: CVSectionProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) pathRef.current.setAttribute("d", pathD);
  }, [pathD]);

  return (
    <div className="cv-section relative min-h-[100vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-4">{title}</h2>
      {children}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <path ref={pathRef} className="cv-path-segment" stroke="black" strokeWidth={3} fill="none" />
      </svg>
    </div>
  );
}
