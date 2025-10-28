'use client';
import React, { useRef, useEffect, PropsWithChildren } from 'react';
import './abstract.css';
import type { Resume } from '@/types/resume';
import { useTranslation } from '@/i18n/provider';

// --- Helper Components ---

const Card = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`card ${className || ''}`}>
        <h3 className="card-title">{title}</h3>
        {children}
    </div>
);

const SectionTitle = ({ title }: { title: string }) => (
    <div className="section-title-wrapper">
        <h2 className="section-title">{title}</h2>
    </div>
);

// --- SVG Hero Component ---
const Hero = ({ basics }: { basics: Resume['basics'] }) => {
    const svgRef = useRef<SVGSVGElement>(null);


    

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const connectingPath = svg.querySelector('#connecting-path') as SVGPathElement;
        if (connectingPath) {
            const isMobile = window.innerWidth <= 768;
            let d = connectingPath.getAttribute('d') || '';
            
            if (isMobile) {
                // On mobile, replace the segment that draws to the center with one that draws to the left
                d = d.replace('H 290', 'H 40');
            }
            // Always extend the path downwards to ensure it goes off-screen
            d = d.replace(/V \d+ *$/, 'V 1000');
            connectingPath.setAttribute('d', d);
        }
        const paths = svgRef.current?.querySelectorAll('path');
        if (!paths) return;

        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
        });

        const timeoutId = setTimeout(() => {
            paths.forEach((path, i) => {
                path.style.transition = `stroke-dashoffset 2s ease-out ${i * 0.05}s`;
                path.style.strokeDashoffset = '0';
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <header id="hero-section" className="hero-section">
            <div className="hero-svg-background">
                <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 300" preserveAspectRatio="xMidYMid">
                     <defs>
                        <linearGradient id="rainbow-loop-hero" x1="0%" y1="0%" x2="0%" y2="200%">
                            <stop offset="0%" stopColor="#ff00c3" />
                            <stop offset="25%" stopColor="#a600ff" />
                            <stop offset="50%" stopColor="#007bff" />
                            <stop offset="75%" stopColor="#00e5ff" />
                            <stop offset="100%" stopColor="#00ff87" />
                            <stop offset="100%" stopColor="#ff00c3" /> 
                            <animate attributeName="y2" from="0%" to="200%" dur="5s" repeatCount="indefinite" />
                        </linearGradient>
                    </defs>
                    <g strokeWidth="1" fill="none" stroke="url(#rainbow-loop-hero)">
                        <path className="svg-path" d="M 130 40 H 210 A 10 10 90 0 0 220 30 A 10 10 90 0 1 230 20 A 10 10 90 0 1 240 30 V 40 A 10 10 90 0 0 250 50 A 10 10 90 0 0 260 40 V 10 A 10 10 90 0 1 270 0 H 300 A 10 10 90 0 1 310 10 V 30 A 10 10 90 1 1 300 20 H 360 A 10 10 90 0 1 360 40 H 330 A 10 10 90 0 0 320 50 V 60 A 10 10 90 1 1 310 50 H 350 A 20 20 90 0 1 370 70 V 90 A 20 20 90 0 0 390 110 H 440 " />
                        <path className="svg-path" d="M 370 90 H 460 A 10 10 90 0 1 460 130 H 380 A 20 20 90 0 0 360 150 " />
                        <path className="svg-path" d="M 380 150 A 20 20 90 0 1 360 170 H 190 A 10 10 90 0 0 190 230 H 390 A 20 20 90 0 0 410 210 " />
                        <path className="svg-path" d="M 410 210 V 180 " />
                        <path className="svg-path" d="M 450 140 H 390 A 5 5 90 0 0 390 150 H 430 " />
                        <path className="svg-path" d="M 440 130 A 5 5 90 1 0 435 125 " />
                        <path className="svg-path" d="M 480 110 H 500 " />
                        <path className="svg-path" d="M 410 100 A 12 12 90 0 1 415 92 A 12 12 90 0 1 440 70 A 13 13 90 0 1 460 80 A 12 12 90 0 1 480 90 " />
                        <path className="svg-path" d="M 110 60 H 180 A 10 10 90 0 1 180 80 H 140 " />
                        <path className="svg-path" d="M 200 70 H 60 A 10 10 90 0 0 60 130 H 140 A 20 20 90 0 1 160 150 " />
                        <path className="svg-path" d="M 140 170 A 20 20 90 0 1 120 150 V 110 A 20 20 90 0 1 140 90 H 180 " />
                        <path className="svg-path" d="M 80 130 A 10 10 90 1 1 80 110 " />
                        <path className="svg-path" d="M 390 160 A 20 20 90 0 0 380 180 A 20 20 90 0 1 360 200 H 280 " />
                        <path className="svg-path" d="M 200 190 H 270 A 10 10 90 0 1 270 210 H 110 A 10 10 90 0 1 100 200 " />
                        <path className="svg-path" d="M 130 220 H 210 A 10 10 90 0 1 220 230 A 10 10 90 0 0 230 240 A 10 10 90 0 0 240 230 A 10 10 90 0 1 250 220 A 10 10 90 0 1 260 230 A 10 10 90 0 0 270 240 " />
                        <path className="svg-path" d="M 330 230 A 10 10 90 1 0 320 220 " />
                        <path className="svg-path" d="M 460 200 A 20 20 90 0 0 440 220 " />
                        <path className="svg-path" d="M 445 220 A 15 15 90 1 1 475 220" />
                        <path id="connecting-path" className="svg-path" d="M 390 170 A 20 20 90 0 0 410 190 H 460 A 10 10 90 0 1 460 250 H 290 a 20 20 90 0 0 -20 20 V 330 " />
                    </g>
                </svg>
            </div>
            <div className="hero-content">
                <h1>{basics.name}</h1>
                <p className="label">{basics.label}</p>
            </div>
        </header>
    );
};

// --- Main Layout Component ---
const AbstractLayout = ({ resume }: { resume: Resume, locale: string }) => {
  const { t } = useTranslation();
  const { basics, work, skills, projects, education } = resume.resumeData;
  const timelineItems = [...(work || []), ...(education || [])].sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

  return (
    <div id="resume-content" className="abstract-layout">
        <Hero basics={basics} />
        <div id="content-container" className="content-container">
            <div className="timeline-line"></div>
            <div className="content-wrapper">

                {timelineItems.length > 0 && (
                    <div id="timeline-section">
                        <SectionTitle title={t('experience.title')} />
                        <div className="timeline-section">
                            {timelineItems.map((item, i) => (
                                <div className="timeline-item" key={i}>
                                    <div className="item-header">
                                        <h3 className="item-title">{'position' in item ? item.position : item.area}</h3>
                                        <span className="item-date">{item.startDate?.substring(0,4)} - {item.endDate?.substring(0,4) || 'Now'}</span>
                                    </div>
                                    <p className="item-subtitle">{'name' in item ? item.name : item.institution}</p>
                                    {'summary' in item && <p className="summary">{item.summary}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skills && (
                    <section>
                        <SectionTitle title={t('skills')} />
                        <div className="cards-grid">
                            {skills.map((skill, i) => (
                                <Card title={skill.name || ''} key={i}>
                                    <div className="skills-list">
                                        {skill.keywords?.map((keyword, j) => (
                                            <span className="skill-tag" key={j}>{keyword}</span>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {projects && (
                    <section>
                        <SectionTitle title={t('projects')} />
                        <div className="cards-grid">
                            {projects.map((project, i) => (
                                <Card title={project.name || ''} key={i}>
                                    <p>{project.description}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    </div>
  );
};

export default AbstractLayout;
