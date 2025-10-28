import { useTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { JSONResume } from "@/types/resume";
import { Resume } from "@/lib/resume";

export const Education = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { education } = resumeData ?? {};
  if (!education) return null;

  return education.length > 0 ? (
    <Section title={t("Resume.Education") + "(" + education.length + ")"}>
      <ul>
        {education.map((item, index) => (
          <SectionDetailItem
            key={index}
            {...item}
            title={item.studyType + " " + item.area}
            subTitle={item.institution}
            keywords={item.courses}
            dateFormat="yyyy"
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};