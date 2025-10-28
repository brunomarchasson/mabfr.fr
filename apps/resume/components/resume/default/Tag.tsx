import React from "react";
import styles from "./Tag.module.css";

type Props = {
  children: React.ReactNode;
};

export function Tag({ children }: Props) {
  return <li className={styles.tag}>{children}</li>;
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) => (
        <Tag key={tag}>{tag}</Tag>
      ))}
    </ul>
  );
}
export default Tag;
