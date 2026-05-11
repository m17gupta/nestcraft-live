"use client";

import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/store/hooks";

export default function ThemeInitializer() {
  const { businessBlueprint } = useAppSelector(
    (state) => state.businessBlueprint,
  );

  const cssVariables = useMemo(() => {
    if (!businessBlueprint) return "";

    const { public: themeConfig } = businessBlueprint.payload.brandAssets || {};
    const { colors, typography } = themeConfig || {};

    console.log(colors, typography);

    if (!colors || !typography) return "";

    // Generate @font-face for custom fonts
    const fontFaces = typography?.customFonts
      ?.map(
        (font: any) => `
      @font-face {
        font-family: '${font.name}';
        src: url('${font.url}');
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-display: swap;
      }
    `,
      )
      .join("\n");

    return `
      ${fontFaces}
      
      :root {
        /* UI Matrix Core Variables */
        --primary: ${colors.core.primary};
        --secondary: ${colors.core.secondary};
        --accent: ${colors.core.accent};
        --background: ${colors.core.background};
        --surface: ${colors.core.surface};
        --text: ${colors.core.text};
        
        /* Button Tactical Variables */
        --btn-primary-bg: ${colors.buttons.primary};
        --btn-primary-text: ${colors.buttons.primaryText};
        --btn-secondary-bg: ${colors.buttons.secondary};
        --btn-secondary-text: ${colors.buttons.secondaryText};
        
        /* Typography Engine Variables */
        --font-main: ${typography.bodyFont};
        --font-heading: ${typography.headingFont};

        /* Overrides for Nestcraft Specific Variables if any */
        --nest-primary: ${colors.core.primary};
      }
      
      /* Global Application Overrides */
      /* We only apply these if the blueprint explicitly defines them */
      ${colors.core.background ? `body { background-color: var(--bg-color); }` : ""}
      ${colors.core.text ? `body { color: var(--text-color); }` : ""}
      ${typography.bodyFont ? `body { font-family: var(--font-main), sans-serif; }` : ""}
      ${typography.headingFont ? `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading), sans-serif; }` : ""}
    `;
  }, [businessBlueprint]);

  useEffect(() => {
    if (!cssVariables) return;

    let styleTag = document.getElementById("dynamic-theme-overrides");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "dynamic-theme-overrides";
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = cssVariables;
  }, [cssVariables]);

  return null;
}
