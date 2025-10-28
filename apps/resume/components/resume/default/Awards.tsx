import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";
import { useTranslation } from "@/i18n/server";
import { Resume } from "@/lib/resume";

export const Awards = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await useTranslation(locale);
  const { resumeData } = resume;
  const { awards } = resumeData ?? {};
  if (!awards) return null;
  return awards.length > 0 ? (
    <Section title={t("Resume.Awards") + "(" + awards.length + ")"}>
      <ul>
        {awards.map((item, index) => (
          <SectionDetailItem
            key={index}
            {...item}
            title={item.title}
            endDate={item.date}
            subTitle={item.awarder}
            dateFormat="yyyy"
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};