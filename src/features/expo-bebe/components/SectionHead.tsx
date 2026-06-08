import styles from "@assets/css/expo-bebe.module.css";

export function SectionHead({
  n,
  text,
  accent,
  accentSuffix,
}: {
  n: string;
  text: string;
  accent: string;
  accentSuffix?: string;
}) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionNum}>{n}</span>
      <h2 className={styles.sectionTitle}>
        {text}{" "}
        <span className={styles.sectionTitleAc}>
          {accent}
          {accentSuffix ? ` ${accentSuffix}` : ""}
        </span>
      </h2>
    </div>
  );
}
