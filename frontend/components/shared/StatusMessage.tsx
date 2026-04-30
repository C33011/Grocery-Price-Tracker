import styles from "./StatusMessage.module.css";

type StatusMessageProps = {
  message: string | null;
  tone?: "error" | "success" | "neutral";
};

export default function StatusMessage({ message, tone = "neutral" }: StatusMessageProps) {
  if (!message) {
    return null;
  }

  const className = [styles.message, tone !== "neutral" ? styles[tone] : ""]
    .filter(Boolean)
    .join(" ");

  return <p className={className}>{message}</p>;
}
