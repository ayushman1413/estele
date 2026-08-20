import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Modal({ open, isOpen, onClose, title, children, size = 'md' }: Props) {
  const isModalVisible = Boolean(open ?? isOpen);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isModalVisible) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isModalVisible, onClose]);

  if (!isModalVisible) return null;

  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full ${widths} rounded-2xl bg-white shadow-soft`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h3 className="font-display text-xl">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 text-ink-500 hover:bg-ink-50" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function useModal(initial = false) {
  const [open, setOpen] = useState(initial);
  return { open, onOpen: () => setOpen(true), onClose: () => setOpen(false) };
}
