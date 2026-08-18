"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React from "react";
import { CartPersist } from "./CartPersist";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartPersist />
      {children}
    </Provider>
  );
}
