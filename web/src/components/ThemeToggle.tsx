import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

/**
 * ThemeToggle.tsx
 * Persists and applies light, dark, or system theme preferences in browser.
 * Assumes `window`, `localStorage`, and `matchMedia` are available after hydration.
 */

/**
 * Reads the initial theme mode from browser storage when available.
 *
 * @returns {ThemeMode} Persisted mode, or `auto` during SSR and fallback cases.
 */
function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "auto";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }

  return "auto";
}

/**
 * Applies the selected theme mode to the root document element.
 *
 * @param {ThemeMode} mode - Requested theme mode selected by the user.
 * @returns {void} No return value; mutates document classes and attributes.
 */
function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

  // Class switching keeps CSS selectors simple while `data-theme` preserves
  // the user's explicit choice for tooling or future selectors.
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);

  if (mode === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }

  document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
  /**
   * Renders a single button that cycles through supported theme modes.
   *
   * @returns {JSX.Element} Interactive theme toggle button.
   */
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    applyThemeMode(initialMode);
  }, []);

  useEffect(() => {
    if (mode !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeMode("auto");

    // System preference listeners only matter in auto mode; explicit user
    // choices must remain stable until the user changes them again.
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [mode]);

  /**
   * Cycles to the next supported theme mode and persists it in storage.
   *
   * @returns {void} No return value; updates component and browser state.
   */
  function toggleMode() {
    const nextMode: ThemeMode =
      mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
    setMode(nextMode);
    applyThemeMode(nextMode);
    window.localStorage.setItem("theme", nextMode);
  }

  const label =
    mode === "auto"
      ? "Theme mode: auto (system). Click to switch to light mode."
      : `Theme mode: ${mode}. Click to switch mode.`;

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {mode === "auto" ? "Auto" : mode === "dark" ? "Dark" : "Light"}
    </button>
  );
}
