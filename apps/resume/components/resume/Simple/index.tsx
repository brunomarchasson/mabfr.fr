import { Resume } from '@/lib/resume';
import React from 'react';
import { FormatDate, FormatDates } from '@/lib/dateHelpers';
import { useTranslation } from '@/i18n/server';

// Helper component for sections
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6 print:mb-4">
    <h2 className="text-xl font-bold border-b-2 border-border pb-1 mb-3 print:text-[14px] break-after-avoid">
      {title.toUpperCase()}
    </h2>
    {children}
  </section>
);

// Helper for work experience
const WorkItem: React.FC<{ job: any; locale: string; t: any }> = ({ job, locale, t }) => (
  <div className="mb-4 break-inside-avoid">
    <header className="flex justify-between items-baseline">
      <h3 className="text-lg font-semibold text-foreground print:text-[13px]">{job.position}</h3>
      <div className="text-sm text-muted-foreground">
        {FormatDates(job.startDate, job.endDate, t('Resume.Current'), locale)}
      </div>
    </header>
    <div className="text-md text-foreground flex justify-between items-baseline">
      <span>{job.name}</span>
      {job.location && <span className="text-sm text-muted-foreground">{job.location}</span>}
    </div>
    {job.summary && <p className="text-sm text-muted-foreground mt-1">{job.summary}</p>}
    <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1 text-sm">
      {job.highlights?.map((highlight: string) => <li key={highlight}>{highlight}</li>)}
    </ul>
    {job.keywords && job.keywords.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {job.keywords.map((keyword: string) => (
          <span key={keyword} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">{keyword}</span>
        ))}
      </div>
    )}
  </div>
);

// Main component
const SimpleLayout = async ({ resume, locale }: { resume: Resume; locale: string; }) => {
  const { t } = await useTranslation(locale);
  const { basics, work, education, skills, projects, languages } = resume.resumeData;

  return (
    <div id="resume-content" className="bg-background font-sans text-foreground print:text-black">
      <div className="max-w-4xl mx-auto p-8 sm:p-10 md:p-12 print:p-0">
        {/* Header */}
        <header className="text-left border-border pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1 text-foreground print:text-[28px]">{basics?.name}</h1>
          <p className="text-lg md:text-xl text-muted-foreground print:text-[16px]">{basics?.label}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-4 text-muted-foreground">
            {basics?.email && <a href={`mailto:${basics.email}`} className="text-primary hover:underline">{basics.email}</a>}
            {basics?.phone && <span>{basics.phone}</span>}
            {basics?.url && <a href={basics.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{basics.url}</a>}
            {basics?.location?.city && <span>{basics.location.city}</span>}
          </div>
        </header>

        {/* Summary */}
        {basics?.summary && (
          <Section title={t('Resume.About')}>
            <p className="text-muted-foreground text-justify">{basics.summary}</p>
          </Section>
        )}

        {/* Work Experience */}
        {work?.length > 0 && (
          <Section title={t('Resume.Work Experience')}>
            {work.map((job: any) => <WorkItem key={job.name + job.startDate} job={job} locale={locale} t={t} />)}
          </Section>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <Section title={t('Resume.Education')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu: any, index) => (
                <div key={index} className="break-inside-avoid">
                   <header className="flex justify-between items-baseline">
                      <h3 className="text-lg font-semibold text-foreground print:text-[13px]">{edu.institution}</h3>
                      <div className="text-sm text-muted-foreground">{FormatDate(edu.endDate, "yyyy", locale)}</div>
                   </header>
                   <div className="text-md text-foreground">{edu.studyType}, {edu.area}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <Section title={t('Resume.Skills')}>
            <div className="flex flex-wrap gap-2">
              {skills.flatMap(skill => skill.keywords).map((keyword: string) => (
                <span key={keyword} className="bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full">{keyword}</span>
              ))}
            </div>
          </Section>
        )}
        
        {/* Projects */}
        {projects?.length > 0 && (
            <Section title={t('Resume.Projects')}>
              <div className="space-y-4">
                {projects.map((project: any) => (
                    <div key={project.name} className="break-inside-avoid">
                        <h3 className="text-lg font-semibold text-foreground print:text-[13px] flex justify-between items-baseline">
                          <span>{project.name}</span>
                          {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{t('Resume.View Project')}</a>}
                        </h3>
                        {project.description && <p className="text-muted-foreground text-sm mt-1">{project.description}</p>}
                        {project.highlights?.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1 text-sm">
                            {project.highlights.map((highlight: string) => <li key={highlight}>{highlight}</li>)}
                          </ul>
                        )}
                        {project.keywords?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.keywords.map((keyword: string) => (
                              <span key={keyword} className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">{keyword}</span>
                            ))}
                          </div>
                        )}
                    </div>
                ))}
              </div>
            </Section>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <Section title={t('Resume.Languages')}>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {languages.map((lang: any) => (
                <span key={lang.language} className="text-muted-foreground text-sm">
                  {lang.language} ({lang.fluency})
                </span>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
};

export default SimpleLayout;