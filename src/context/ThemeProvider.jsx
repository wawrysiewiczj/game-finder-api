import React, { createContext, useContext, useEffect, useState } from "react";

// Tworzenie kontekstu dla motywu
const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => null,
});

// Hook do łatwego dostępu do kontekstu motywu
export const useTheme = () => useContext(ThemeContext);

// Komponent ThemeProvider, który zarządza stanem motywu
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}) {
  // Odczytanie zapisanego motywu lub użycie domyślnego
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Aktualizacja motywu w local storage i dokumentu HTML
  useEffect(() => {
    const root = window.document.documentElement;

    // Usuń poprzedni motyw
    root.classList.remove("light", "dark");

    // Dodaj nowy motyw lub zastosuj preferencje systemowe
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Zapisz motyw w local storage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Obsługa zmiany preferencji systemowych
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Wartość kontekstu
  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

// Komponent przełącznika motywu
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md hover:bg-primary/10"
      title={
        theme === "dark"
          ? "Przełącz na jasny motyw"
          : "Przełącz na ciemny motyw"
      }
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeProvider;
