"use client";

import { useEffect, useMemo } from "react";
import { useAppSelector } from "@/lib/store/hooks";

export default function ThemeInitializer() {
  const { businessBlueprint } = useAppSelector(
    (state) => state.businessBlueprint,
  );

  const cssVariables = useMemo(() => {
    if (!businessBlueprint) return "";

    // Handle both nested and flattened structures
    const payload = businessBlueprint.payload || businessBlueprint;
    const brandAssets = payload?.brandAssets;
    
    if (!brandAssets) {
      console.warn("ThemeInitializer: brandAssets not found in businessBlueprint", businessBlueprint);
      return "";
    }

    const themeConfig = brandAssets.public || brandAssets;
    const { colors, typography } = themeConfig || {};

    if (!colors || !typography) {
      console.warn("ThemeInitializer: colors or typography missing", { colors, typography });
      return "";
    }

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
        --primary: ${colors.core?.primary || '#000000'};
        --secondary: ${colors.core?.secondary || '#000000'};
        --accent: ${colors.core?.accent || '#000000'};
        --background: ${colors.core?.background || '#ffffff'};
        --surface: ${colors.core?.surface || '#ffffff'};
        --text: ${colors.core?.text || '#000000'};
        
        /* Button Tactical Variables */
        --btn-primary-bg: ${colors.buttons?.primary || '#000000'};
        --btn-primary-text: ${colors.buttons?.primaryText || '#ffffff'};
        --btn-secondary-bg: ${colors.buttons?.secondary || '#ffffff'};
        --btn-secondary-text: ${colors.buttons?.secondaryText || '#000000'};
        
        /* Typography Engine Variables */
        --font-main: ${typography?.bodyFont || 'sans-serif'};
        --font-heading: ${typography?.headingFont || 'sans-serif'};

        /* Overrides for Nestcraft Specific Variables if any */
        --nest-primary: ${colors.core?.primary || '#000000'};
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
