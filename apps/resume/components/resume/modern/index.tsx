'use client';
import React, { useRef, useEffect, PropsWithChildren } from 'react';
import './modern.css';
import type { Resume } from '@/types/resume';
import { useTranslation } from '@/i18n/provider';
import { useIntersectionObserver } from '@/lib/hooks';

// --- HELPERS ---

const formatDate = (date: string | undefined, locale: string) => {
  if (!date) return 'Present';
  return new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short' });
};

// --- GENERIC COMPONENTS ---

const AnimatedSection = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <div ref={ref} className={`animated-section ${isVisible ? 'is-visible' : ''} ${className || ''}`}>
      {children}
    </div>
  );
};

// --- LAYOUT & SECTIONS ---

const Header = ({ basics }: { basics: Resume['basics'] }) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const yOffset = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${yOffset * 0.5}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div ref={parallaxRef} className="header-container">
      <header className="header">
        <h1>{basics.name}</h1>
        <div className="label">{basics.label}</div>
        <div className="contact">
          {basics.email && <a href={`mailto:${basics.email}`}>{basics.email}</a>}
          {basics.phone && <><span>&bull;</span><span>{basics.phone}</span></>}
          {basics.url && <><span>&bull;</span><a href={basics.url.href} target="_blank" rel="noopener noreferrer">{basics.url.label}</a></>}
        </div>
      </header>
    </div>
  );
};

const TimelineSection = ({ items, title, locale }: { items: (Resume['work'][0] | Resume['education'][0])[], title: string, locale: string }) => (
  <AnimatedSection className="timeline-section">
    <h2 className="timeline-title">{title}</h2>
    {items.map((item, index) => (
      <div className="timeline-item" key={index}>
        <div className="item-header">
          <div>
            <h3 className="item-title">{'position' in item ? item.position : `${item.studyType}, ${item.area}`}</h3>
            <div className="item-subtitle">{'name' in item ? item.name : item.institution}</div>
          </div>
          <div className="item-date">
            {formatDate(item.startDate, locale)} - {formatDate(item.endDate, locale)}
          </div>
        </div>
        {'summary' in item && item.summary && <div className="summary">{item.summary}</div>}
        {'highlights' in item && item.highlights && (
          <div className="highlights">
            <ul>
              {item.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
            </ul>
          </div>
        )}
      </div>
    ))}
  </AnimatedSection>
);

const SkillsSection = ({ items }: { items: Resume['skills'] }) => {
  const { t } = useTranslation();
  return (
    <AnimatedSection className="skills-section">
      <h2 className="section-title">{t('skills')}</h2>
      {items.map((skill, index) => (
        <div className="item" key={index}>
          <h3 className="item-title">{skill.name}</h3>
          <div className="skills-list">
            {skill.keywords.map((keyword, i) => <span className="skill-tag" key={i}>{keyword}</span>)}
          </div>
        </div>
      ))}
    </AnimatedSection>
  );
};

const ProjectsSection = ({ items, locale }: { items: Resume['projects'], locale: string }) => {
  const { t } = useTranslation();
  return (
    <AnimatedSection className="projects-section">
      <h2 className="section-title">{t('projects')}</h2>
      <div className="projects-grid">
        {items.map((item, index) => (
          <div className="project-card" key={index}>
            <div className="item-header">
              <h3 className="item-title">{item.name}</h3>
              <div className="item-date">{formatDate(item.startDate, locale)} - {formatDate(item.endDate, locale)}</div>
            </div>
            {item.summary && <div className="summary">{item.summary}</div>}
            {item.highlights && (
              <div className="highlights">
                <ul>
                  {item.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                </ul>
              </div>
            )}
             {item.url && <a href={item.url.href} target="_blank" rel="noopener noreferrer" className="item-subtitle">View Project</a>}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

// --- MAIN COMPONENT ---

const ModernLayout = ({ resume: {resumeData:resume}, locale }: { resume: Resume, locale: string }) => {
  const { t } = useTranslation();
  const experienceItems = [...(resume.work || []), ...(resume.education || [])];
  experienceItems.sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime());

  return (
    <div id="resume-content" className="modern-layout">
      <div className="container">
        <Header basics={resume.basics} />
        
        {(resume.work || resume.education) && 
          <TimelineSection 
            items={experienceItems} 
            title={t('experience.title')}
            locale={locale} 
          />
        }

        {resume.skills && <SkillsSection items={resume.skills} />}
        {resume.projects && <ProjectsSection items={resume.projects} locale={locale} />}

      </div>
    </div>
  );
};

export default ModernLayout;
