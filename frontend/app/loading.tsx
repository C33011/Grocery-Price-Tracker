import LoadingState from "@/components/shared/LoadingState";
import PageShell from "@/components/shared/PageShell";

export default function Loading() {
  return (
    <PageShell>
      <LoadingState title="Loading page" />
    </PageShell>
  );
}
