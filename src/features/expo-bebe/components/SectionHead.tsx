import styles from "@assets/css/expo-bebe.module.css";

export function SectionHead({
  n,
  text,
  accent,
}: {
  n: string;
  text: string;
  accent: string;
}) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionNum}>{n}</span>
      <h2 className={styles.sectionTitle}>
        {text} <span className={styles.sectionTitleAc}>{accent}</span>
      </h2>
    </div>
  );
}
