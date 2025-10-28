import { useTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionItem } from "./SectionItem";
import { JSONResume } from "@/types/resume";
import { Resume } from "@/lib/resume";

export const Interests = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { interests } = resumeData ?? {};

  if (!interests) return null;

  return (
    <>
      {interests.length && (
        <Section title={t("Resume.Interests")}>
          <ul>
            {interests.map((item, index) => (
              <SectionItem
                key={index}
                name={item.name}
                keywords={item.keywords}
              ></SectionItem>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
};