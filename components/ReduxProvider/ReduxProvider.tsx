"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { setTheme } from "@/store/themeSlice";
import { useEffect } from "react";

function ThemePersist({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load theme from localStorage on mount
    const saved = localStorage.getItem("imageflow-theme") as "light" | "dark" | null;
    if (saved) {
      store.dispatch(setTheme(saved));
    }

    // Subscribe to store changes and save to localStorage
    const unsubscribe = store.subscribe(() => {
      const mode = store.getState().theme.mode;
      localStorage.setItem("imageflow-theme", mode);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemePersist>
        {children}
      </ThemePersist>
    </Provider>
  );
}