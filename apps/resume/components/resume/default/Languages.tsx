import { useTranslation } from "@/i18n/server";
import { JSONResume } from "@/types/resume";
import { Section } from "./Section";
import { SectionItem } from "./SectionItem";

export const Languages = async ({
  languages,
  className,
  locale
}: {
  languages: JSONResume["languages"];
  className?: string;
  locale: string;
}) => {
   const { t } = await useTranslation(locale);
  if(!languages) return null;
  return (
    <>
      {languages.length && (
        <Section title={t("Resume.Languages")} className={className}>
          <ul>
            {languages.map((language, index) => (
              <SectionItem
                key={index}
                name={language.language}
                level={language.fluency}
              ></SectionItem>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
};