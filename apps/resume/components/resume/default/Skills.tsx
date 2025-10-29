import { getTranslation } from "@/i18n/server";
import { Section } from "./Section";
import { SectionItem } from "./SectionItem";
import { JSONResume } from "@/types/resume";

export const Skills = async ({ skills, className, locale }: { skills: JSONResume["skills"]; className?: string, locale: string }) => {
  const { t } = await getTranslation(locale);
  if(!skills) return null;
  return skills.length > 0 ? (
    <Section title={t("Resume.Skills")} className={className}>
      <ul>
        {skills.map((skill, index) => (
          <SectionItem
            key={index}
            name={skill.name}
            level={skill.level}
            keywords={skill.keywords}
          ></SectionItem>
        ))}
      </ul>
    </Section>
  ) : null;
};