import { STATUS_COLOR, STATUS_FLOW, STATUS_LABEL } from '../utils/format';
import type { OrderStatus as S } from '../types';

export default function OrderStatus({ status }: { status: S }) {
  const cls = STATUS_COLOR[status] ?? 'bg-ink-100 text-ink-700 border-ink-200';
  return (
    <span className={`chip ${cls} border`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function OrderTimeline({ status }: { status: S }) {
  const denied = status === 'denied' || status === 'cancelled';
  const idx = STATUS_FLOW.indexOf(status);

  if (denied) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        Order {status}.
      </div>
    );
  }

  return (
    <ol className="flex flex-wrap items-center gap-3 text-xs">
      {STATUS_FLOW.map((step, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium ${
                done ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white text-ink-300'
              } ${current ? 'ring-2 ring-gold-300' : ''}`}
            >
              {i + 1}
            </span>
            <span className={done ? 'text-ink-900 font-medium' : 'text-ink-300'}>
              {STATUS_LABEL[step]}
            </span>
            {i < STATUS_FLOW.length - 1 && <span className="mx-1 h-px w-6 bg-ink-200" />}
          </li>
        );
      })}
    </ol>
  );
}
