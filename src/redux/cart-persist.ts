import type { CartItem } from "./features/cart-slice";

export const CART_STORAGE_KEY = "ads_cart_v1";

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "number" &&
    Number.isFinite(item.id) &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.discountedPrice === "number" &&
    typeof item.quantity === "number" &&
    typeof item.img === "string"
  );
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem).map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      discountedPrice: item.discountedPrice,
      quantity: Math.max(1, Math.min(99, Math.round(item.quantity))),
      img: item.img,
    }));
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota / private-mode failures
  }
}
