"use server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { getTranslation } from "@/i18n/server";
import { Resume } from "@/lib/resume";

export const Work = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await getTranslation(locale);
  const { resumeData } = resume;
  const { work } = resumeData ?? {};
  if (!work) return null;
  return work.length ? (
    <Section title={t("Resume.Work Experience") + "(" + work.length + ")"}>
      <ul>
        {work.map((workItem, index) => (
          <SectionDetailItem
            key={index}
            {...workItem}
            title={workItem.position}
            subTitle={workItem.name}
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};