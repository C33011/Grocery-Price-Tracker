import ListDetailPage from "@/components/list-detail/ListDetailPage";

type ListDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: ListDetailRouteProps) {
  const { id } = await params;

  return <ListDetailPage listId={Number(id)} />;
}
