import { useTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { JSONResume } from "@/types/resume";
import { Resume } from "@/lib/resume";

export const Volunteer = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { volunteer } = resumeData ?? {};

  if (!volunteer) return null;

  return volunteer.length > 0 ? (
    <Section title={t("Resume.Volunteer") + "(" + volunteer.length + ")"}>
      <ul>
        {volunteer.map((item, index) => (
          <SectionDetailItem
            key={index}
            {...item}
            title={item.position}
            subTitle={item.organization}
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};