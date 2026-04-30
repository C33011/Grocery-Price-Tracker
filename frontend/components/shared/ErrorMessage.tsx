import StatusMessage from "./StatusMessage";

type ErrorMessageProps = {
  message: string | null;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return <StatusMessage message={message} tone="error" />;
}
