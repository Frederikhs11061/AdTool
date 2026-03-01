import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/products/${params.id}/actions`);
}
