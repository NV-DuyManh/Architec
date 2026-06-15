import React, { useState, useEffect } from "react";

/**
 * ThemeToggle — Nút chuyển Dark / Light mode.
 *
 * • Đọc / ghi "theme" trong localStorage.
 * • Thêm / gỡ class "light-mode" trên document.body.
 * • Dùng class .glass-panel (đã định nghĩa trong style.css).
 * • Hoàn toàn độc lập, không phụ thuộc context hay state bên ngoài.
 *
 * Cách dùng:
 *   import ThemeToggle from "./ThemeToggle";
 *   <ThemeToggle />
 */

/* ── Icon SVG nhỏ gọn ─────────────────────────── */
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/* ── Component ─────────────────────────────────── */
const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // SSR-safe: chỉ đọc localStorage phía client
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "dark";
    }
    return "dark";
  });

  /* Sync class trên <body> mỗi khi theme thay đổi */
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      onClick={toggle}
      className="glass-panel"
      aria-label={theme === "dark" ? "Chuyển sang Light Mode" : "Chuyển sang Dark Mode"}
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
      style={btnStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-primary)";
        e.currentTarget.style.boxShadow =
          "0 0 18px color-mix(in srgb, var(--accent-primary) 35%, transparent)";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-glass)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

/* ── Inline styles (không phụ thuộc file CSS ngoài ngoài .glass-panel) ── */
const btnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 42,
  height: 42,
  padding: 0,
  cursor: "pointer",
  color: "var(--text-main)",
  background: "var(--bg-glass)",
  border: "1px solid var(--border-glass)",
  borderRadius: "var(--radius-sm, 8px)",
  transition: "all 0.25s ease",
};
