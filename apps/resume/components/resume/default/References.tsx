import { getTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { Resume } from "@/lib/resume";

export const References = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await getTranslation(locale);
  const { resumeData } = resume;
  const { references } = resumeData ?? {};

  if (!references) return null;

  return (
    <>
      {references.length && (
        <Section title={t("Resume.References") + "(" + references.length + ")"}>
          {references.map((item, index) => (
            <figure className="quote" key={index}>
              <blockquote>{item.reference}</blockquote>
              <figcaption>&mdash;{item.name}</figcaption>
            </figure>
          ))}
        </Section>
      )}
    </>
  );
};