"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import parse from "svg-path-parser";
import { Resume } from "@/lib/resume";
import Work from "./Work";
import SectionLocal from "./SectionLocal";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

// Helper to transform local path commands to global coordinates
function transformPathCommands(commands: any[], scaleX: number, scaleY: number, offsetY: number, lastPos: { x: number | null; y: number | null; }) {
    const fmt = (n: number) => Number(n.toFixed(2));
    const transformed: string[] = [];
    
    commands.forEach((c) => {
        const code = c.code;
        switch (code) {
            case "M":
                lastPos.x = c.x * scaleX;
                lastPos.y = c.y * scaleY + offsetY;
                transformed.push(`M${fmt(lastPos.x)} ${fmt(lastPos.y)}`);
                break;
            case "L":
                lastPos.x = c.x * scaleX;
                lastPos.y = c.y * scaleY + offsetY;
                transformed.push(`L${fmt(lastPos.x)} ${fmt(lastPos.y)}`);
                break;
            case "C":
                const x1 = c.x1 * scaleX, y1 = c.y1 * scaleY + offsetY;
                const x2 = c.x2 * scaleX, y2 = c.y2 * scaleY + offsetY;
                lastPos.x = c.x * scaleX;
                lastPos.y = c.y * scaleY + offsetY;
                transformed.push(`C${fmt(x1)} ${fmt(y1)}, ${fmt(x2)} ${fmt(y2)}, ${fmt(lastPos.x)} ${fmt(lastPos.y)}`);
                break;
            case "Q":
                const qx1 = c.x1 * scaleX, qy1 = c.y1 * scaleY + offsetY;
                lastPos.x = c.x * scaleX;
                lastPos.y = c.y * scaleY + offsetY;
                transformed.push(`Q${fmt(qx1)} ${fmt(qy1)}, ${fmt(lastPos.x)} ${fmt(lastPos.y)}`);
                break;
        }
    });
    return transformed.join(" ");
}

// Helper function to build the global path from all section segments
export function buildGlobalPath(container: HTMLElement, containerWidth: number) {
    const sections = Array.from(container.querySelectorAll<HTMLElement>(".cv-section"));
    const transformedSegments: string[] = [];
    const lastPos: { x: number | null; y: number | null } = { x: null, y: null };

    sections.forEach((section) => {
        const localPathEl = section.querySelector<SVGPathElement>(".cv-path-segment");
        if (!localPathEl) return;

        const localD = localPathEl.getAttribute("d");
        if (!localD) return;

        let commands;
        try {
            commands = parse(localD);
        } catch (e) {
            console.warn("Error parsing path", e, localD);
            return;
        }

        const sectionTop = section.offsetTop;
        const sectionH = section.offsetHeight || 0;
        const viewBoxWidth = localPathEl.closest('svg')?.viewBox.baseVal.width || 100;
        const viewBoxHeight = localPathEl.closest('svg')?.viewBox.baseVal.height || 100;

        const scaleX = containerWidth / viewBoxWidth;
        const scaleY = sectionH / viewBoxHeight;

        const transformed = transformPathCommands(commands, scaleX, scaleY, sectionTop, lastPos);
        transformedSegments.push(transformed);
    });

    return transformedSegments.join(" ");
}


interface LineResumeClientProps {
  resume: Resume;
  locale: string;
}

export default function LineResumeClient({ resume: { resumeData: resume }, locale }: LineResumeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathGuideRef = useRef<SVGPathElement>(null);
  const bubbleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const container = containerRef.current;
     if (!containerRef.current || !pathRef.current || !pathGuideRef.current || !bubbleRef.current) return;


    const path = pathRef.current;
     const pathGuide = pathGuideRef.current;
    const bubble = bubbleRef.current;
    const svg = svgRef.current;

    const timeoutId = setTimeout(() => {
      const containerWidth = container.clientWidth;
      const containerHeight = container.scrollHeight;

      svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);
      svg.style.width = `${containerWidth}px`;
      svg.style.height = `${containerHeight}px`;

      const fullD = buildGlobalPath(container, containerWidth);
      path.setAttribute("d", fullD);
    pathGuide.setAttribute("d", fullD);
      const pathLength = path.getTotalLength();

      if(pathLength === 0) return; // Don't create animation for empty path

      ScrollTrigger.getAll().forEach((st) => st.kill());

      gsap.set(path, { drawSVG: 0 });
    //   gsap.set(bubble, { autoAlpha: 1 });

      gsap.to(path, {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: container,
        scroller: container,
          start: "top top",
           end: () => `${container.scrollHeight - container.clientHeight}px`,
        markers: true,

        scrub: true,
          onUpdate: (self) => {
const length = pathLength * self.progress;
    console.log("Current path length:", length, self.progress, pathLength);  // === dessine le chemin jusqu’au point actuel ===
    gsap.set(path, { drawSVG: `0 ${length}` });

    // === place la bulle ===
            const point = path.getPointAtLength(length);
            gsap.set(bubble, { x: point.x, y: point.y });
          },
        },
      });

      ScrollTrigger.refresh();
    }, 300); // Increased delay for stability

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [resume]);

  const pathA = "M50 0 C70 20, 30 40, 50 60 V100";
  const pathB = "M50 0 C30 20, 70 40, 50 60 V100";

  return (
    <div ref={containerRef} className="relative h-[100vh] overflow-y-auto bg-gray-50 font-sans">
      <svg ref={svgRef} className="absolute top-0 left-0 w-full z-10 pointer-events-none">
        <path ref={pathRef} stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={pathGuideRef} stroke="blue" strokeWidth="4" fill="none" opacity={.3} />
        <circle ref={bubbleRef} r="6" fill="tomato" />
      </svg>

      <header className="cv-section h-[100vh] flex flex-col items-center justify-center relative z-20 bg-white text-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: 0 }}>
          <path className="cv-path-segment" d="M 50 0 V 100" />
        </svg>
        <h1 className="text-5xl font-bold z-20 relative">{resume.basics?.name}</h1>
        <p className="text-xl text-gray-600 z-20 relative mt-2">{resume.basics?.label}</p>
      </header>

      {resume.work && resume.work.length > 0 && <Work work={resume.work} />}

      {resume.skills && (
        <SectionLocal title="Compétences" pathLocal={pathA}>
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
            {resume.skills.map((s, i) => (
                <span key={`skill-${i}`} className="px-4 py-2 bg-gray-200 rounded-full text-sm font-medium">{s.name}</span>
            ))}
            </div>
        </SectionLocal>
      )}

      {resume.projects?.map((p, i) => (
         <SectionLocal key={`project-${i}`} title="Projets" pathLocal={i % 2 === 0 ? pathB : pathA}>
            <div className="max-w-xl">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-2 text-gray-700">{p.summary}</p>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {p.keywords?.map(k => <span key={k} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{k}</span>)}
                </div>
            </div>
        </SectionLocal>
      ))}

      {resume.education?.map((e, i) => (
        <SectionLocal key={`edu-${i}`} title="Éducation" pathLocal={(i + (resume.projects?.length || 0)) % 2 === 0 ? pathB : pathA}>
            <div className="max-w-xl">
                <h3 className="text-xl font-bold">{e.institution}</h3>
                <p className="text-lg">{e.area}, {e.studyType}</p>
                <p className="text-sm text-gray-500 mt-1">{e.startDate} - {e.endDate}</p>
            </div>
        </SectionLocal>
      ))}
    </div>
  );
}