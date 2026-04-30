import Nav from "@/components/shared/Nav";
import styles from "./PageShell.module.css";

type PageShellProps = {
  children: React.ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  showNav?: boolean;
};

export default function PageShell({
  children,
  eyebrow,
  title,
  subtitle,
  compact = false,
  showNav = true,
}: PageShellProps) {
  return (
    <main className={compact ? styles.shellCompact : styles.shell}>
      {showNav && <Nav />}
      <div className={styles.content}>
        {title && (
          <header className={styles.hero}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </main>
  );
}
