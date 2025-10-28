
import { TagList } from "./Tag";
import styles from "./SectionItem.module.css";
import clsx from "clsx";

type Props = { name?: string; level?: string; keywords?: string[] };

export function SectionItem({ name, level, keywords }: Props) {
  return (
    <li className={styles.sectionItem}>
      {name && <h3>{name}</h3>}
      {level && (
        <div className={clsx(styles.level, styles[level.toLowerCase()])}>
          <em>{level}</em>
        </div>
      )}
      {keywords?.length && <TagList tags={keywords} />}
    </li>
  );
}
