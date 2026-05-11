import React from "react";
import ThemeManager from "./ThemeManager";

export const metadata = {
  title: "Theme Management | Nestcraft Admin",
  description: "Configure global site aesthetics, color palettes, and typography.",
};

export default function ThemePage() {
  return <ThemeManager />;
}
