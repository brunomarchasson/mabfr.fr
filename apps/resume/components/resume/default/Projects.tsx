import { useTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { JSONResume } from "@/types/resume";
import { Resume } from "@/lib/resume";

export const Projects = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { projects } = resumeData ?? {};

  if (!projects) return null;

  return projects.length > 0 ? (
    <Section
      title={t("Resume.Projects") + "(" + projects.length + ")"}
      printPageBreakBefore
    >
      <ul>
        {projects.map((project, index) => (
          <SectionDetailItem
            key={index}
            {...project}
            title={project.name}
            summary={project.description}
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};