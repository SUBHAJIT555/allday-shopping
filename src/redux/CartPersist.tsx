"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hydrateCart, selectCartItems } from "./features/cart-slice";
import { loadCartFromStorage, saveCartToStorage } from "./cart-persist";
import { useAppSelector } from "./store";

export function CartPersist() {
  const dispatch = useDispatch();
  const items = useAppSelector(selectCartItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch(hydrateCart(loadCartFromStorage()));
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveCartToStorage(items);
  }, [hydrated, items]);

  return null;
}
