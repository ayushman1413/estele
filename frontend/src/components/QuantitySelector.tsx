import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  size?: 'sm' | 'md';
}

export default function QuantitySelector({ value, min = 1, max = 99, onChange, size = 'md' }: Props) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className="inline-flex items-center rounded-full border border-ink-200 bg-white">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`flex ${dim} items-center justify-center rounded-l-full text-ink-700 transition hover:bg-ink-50 disabled:opacity-40`}
      >
        <Minus className={icon} />
      </button>
      <span className={`min-w-[2.25rem] text-center text-sm font-medium ${size === 'sm' ? 'px-2' : 'px-3'}`}>
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`flex ${dim} items-center justify-center rounded-r-full text-ink-700 transition hover:bg-ink-50 disabled:opacity-40`}
      >
        <Plus className={icon} />
      </button>
    </div>
  );
}
