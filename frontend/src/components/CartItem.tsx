import { Trash2 } from 'lucide-react';
import type { CartItem as CI } from '../types';
import { formatPrice } from '../utils/format';
import QuantitySelector from './QuantitySelector';

interface Props {
  item: CI;
  onQty: (qty: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function CartItem({ item, onQty, onRemove, disabled }: Props) {
  return (
    <div className="flex gap-4 border-b border-ink-100 py-5 last:border-b-0">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-ink-50">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg leading-tight">{item.name}</h3>
            <p className="mt-0.5 text-xs text-ink-500">{formatPrice(item.price)} each</p>
          </div>
          <button
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove ${item.name}`}
            className="rounded-full p-1.5 text-ink-500 transition hover:bg-ink-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantitySelector
            value={item.quantity}
            max={item.stock}
            onChange={onQty}
            size="sm"
          />
          <span className="font-display text-lg font-medium">{formatPrice(item.subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
