"use server";

import { TagList } from "./Tag";
import { IconLib } from "../../icons";
import { useTranslation } from "@/i18n/server";
import { FormatDate } from "@/lib/dateHelpers";
import styles from "./SectionDetailItem.module.css";
import IconText from "./IconText";

type Iso8601 = string;

type Props = {
  subTitle?: string;
  location?: string;
  summary?: string;
  title?: string;
  url?: string;
  startDate?: Iso8601;
  endDate?: Iso8601;
  highlights?: string[];
  keywords?: string[];
  dateFormat?: string;
  locale: string;
};

export const SectionDetailItem = async ({
  subTitle,
  location,
  summary,
  title,
  url,
  startDate,
  endDate,
  highlights,
  keywords,
  dateFormat,
  locale,
}: Props) => {
  const { t } = await useTranslation(locale);

  return (
    <li className={styles.sectionDetailItem}>
      <header className={styles.header}>
        <div className={styles.dates}>
          {startDate && (
            <span>
              {FormatDate(startDate, dateFormat, locale)}
              {"\u00A0"}
            </span>
          )}
          {endDate ? (
            <span>{FormatDate(endDate, dateFormat, locale)}</span>
          ) : startDate ? (
            <span>{`${t("Resume.Current")}`}</span>
          ) : null}
        </div>
        {title && (
          <h3 className={styles.title}>
            {title}
            {subTitle && <span className={styles.subTitle}>{subTitle}</span>}
          </h3>
        )}
      </header>

      {location && <IconText icon={IconLib.location} text={location} />}
      {url && (
        <a target="_blank" href={url} rel="noreferrer">
          <IconText icon={IconLib.web} text={url} />
        </a>
      )}
      {keywords?.length && <TagList tags={keywords} />}

      {summary && <div className={styles.summary}>{summary}</div>}

      {highlights?.length && (
        <ul className={styles.highlights}>
          {highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      )}
    </li>
  );
};