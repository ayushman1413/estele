export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  products_count?: number;
}

export interface Product {
  id: number;
  category_id?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number | null;
  discount_percent?: number;
  stock: number;
  in_stock?: boolean;
  image: string;
  gallery?: string[];
  rating?: number;
  rating_count?: number;
  is_featured: boolean;
  is_active: boolean;
  category?: { id: number; name: string; slug: string };
}

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  item_count: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export type OrderStatus =
  | 'pending' | 'accepted' | 'processing' | 'shipped'
  | 'delivered' | 'denied' | 'cancelled';

export type OrderStatusType = OrderStatus;

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface Order {
  id: number;
  order_number?: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  notes?: string | null;
  placed_at?: string | null;
  created_at?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items?: OrderItem[];
  items_count?: number;
  user?: { id: number; name: string; email: string };
}

export interface AdminStats {
  total_orders: number;
  pending_orders: number;
  accepted_orders: number;
  denied_orders: number;
  delivered_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Paginated<T> {
  items: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
