import { useTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { Resume } from "@/lib/resume";

export const Publications = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { publications } = resumeData ?? {};

  if (!publications) return null;

  return publications.length > 0 ? (
    <Section title={t("Resume.Publications") + "(" + publications.length + ")"}>
      <ul>
        {publications.map((item, index) => (
          <SectionDetailItem
            key={index}
            {...item}
            title={item.name}
            subTitle={item.publisher}
            endDate={item.releaseDate}
            dateFormat="dd LLL yyyy"
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};