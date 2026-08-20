import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: { label: string; to: string };
}

export default function EmptyState({ icon: Icon, title, description, cta }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
        <Icon className="h-6 w-6 text-ink-500" />
      </div>
      <h3 className="font-display text-2xl font-medium">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-500">{description}</p>}
      {cta && (
        <Link to={cta.to} className="btn-primary mt-6">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
