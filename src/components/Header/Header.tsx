import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header} aria-label="Site header">
      <div className={styles.logoContainer}>
        <Link href="/home">
          <Image
            src="/assets/logo.jpg"
            alt="MyMemories Logo"
            width={150}
            height={110}
            className={styles.logo}
            aria-label="My Memories Logo"
            priority
          />
        </Link>
      </div>
      <h1 className={styles.title}>MyMemories</h1>
    </header>
  );
}
