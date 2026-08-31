import { redirect } from 'next/navigation';
import { topics } from '../../../data/topics';

export async function generateStaticParams() {
  return topics.map((topic) => ({
    id: topic.id,
  }));
}

export default async function ResourceAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/resources/${id}`);
}
