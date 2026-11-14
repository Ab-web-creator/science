import Link from "next/link";
import styles from "./learning-card.module.css";

export type LearningCardProps = {
  href: string;
  number: number;
  equation: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  recommended?: boolean;
  kind?: string;
};

export function LearningCard({
  href,
  number,
  equation,
  title,
  description,
  icon,
  action,
  recommended = false,
  kind = "Example",
}: LearningCardProps) {
  return (
    <Link href={href} className={styles.card} data-color={(number - 1) % 5}>
      <div className={styles.top}>
        <span className={styles.number}>
          {kind} {number}
        </span>
        {recommended && (
          <span className={styles.recommended}>★ Start here</span>
        )}
      </div>
      <div className={styles.math}>
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        <span className={styles.equation}>{equation}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      <span className={styles.action}>
        {action}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export const learningGridClass = styles.grid;
