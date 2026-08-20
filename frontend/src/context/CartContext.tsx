import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api, describeError } from '../services/api';
import { useAuth } from './AuthContext';
import type { Cart, CartItem } from '../types';
import toast from 'react-hot-toast';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clear: () => Promise<void>;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartState | undefined>(undefined);

const emptyCart: Cart = { id: 0, items: [], item_count: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/cart');
      setCart(res.data.data);
    } catch (err) {
      toast.error(describeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart.');
      window.location.href = '/login';
      return;
    }
    try {
      const res = await api.post('/cart/items', { product_id: productId, quantity });
      setCart(res.data.data);
      toast.success('Added to cart');
    } catch (err) {
      const e = describeError(err);
      if (e.status === 401) {
        toast.error('Please sign in to add items to your cart.');
        window.location.href = '/login';
      } else {
        toast.error(e.message);
      }
      throw e;
    }
  }, [user]);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    try {
      const res = await api.patch(`/cart/items/${itemId}`, { quantity });
      setCart(res.data.data);
    } catch (err) {
      toast.error(describeError(err).message);
    }
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      setCart(res.data.data);
    } catch (err) {
      toast.error(describeError(err).message);
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      const res = await api.delete('/cart');
      setCart(res.data.data);
    } catch (err) {
      toast.error(describeError(err).message);
    }
  }, []);

  const value = useMemo<CartState>(() => ({
    cart: cart ?? (user ? emptyCart : null),
    loading,
    refresh,
    addItem, updateItem, removeItem, clear,
    count: cart?.item_count ?? 0,
    subtotal: cart?.subtotal ?? 0,
  }), [cart, loading, refresh, addItem, updateItem, removeItem, clear, user]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export type { CartItem };
