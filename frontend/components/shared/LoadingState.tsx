import styles from "./LoadingState.module.css";

type LoadingStateProps = {
  title?: string;
  message?: string;
};

export default function LoadingState({
  title = "Loading",
  message = "One moment.",
}: LoadingStateProps) {
  return (
    <section className={styles.state} aria-live="polite" aria-busy="true">
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.copy}>
        <strong>{title}</strong>
        <span>{message}</span>
      </div>
    </section>
  );
}
