import SharedView from '@/components/SharedView';

interface SharePageProps {
  params: { shareId: string };
}

export default function SharePage({ params }: SharePageProps) {
  return <SharedView shareId={params.shareId} />;
}
