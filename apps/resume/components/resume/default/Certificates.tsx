import { getTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionDetailItem } from "./SectionDetailItem";

import { Resume } from "@/lib/resume";

export const Certificates = async ({ resume, locale }: { resume: Resume, locale: string }) => {
  const { t } = await getTranslation(locale);
  const { resumeData } = resume;
  const { certificates } = resumeData ?? {};

  if (!certificates) return null;

  return certificates.length > 0 ? (
    <Section title={t("Resume.Certificates") + "(" + certificates.length + ")"}>
      <ul>
        {certificates.map((item, index) => (
          <SectionDetailItem
            key={index}
            {...item}
            title={item.name}
            endDate={item.date}
            subTitle={item.issuer}
            dateFormat="yyyy"
            locale={locale}
          />
        ))}
      </ul>
    </Section>
  ) : null;
};