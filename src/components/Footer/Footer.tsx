import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.credit}>Created with 💚</p>
      </div>
    </footer>
  );
}
