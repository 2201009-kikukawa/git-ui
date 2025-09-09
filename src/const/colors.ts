export const VSCODE_THEME_COLORS = {
  sidebarBackground: "var(--vscode-sideBar-background)",
  sideBarForeground: "var(--vscode-sideBar-foreground)",
  descriptionText: "var(--vscode-descriptionForeground)",
  customBorder: "var(--vscode-widget-border)",
  listHoverBackground: "var(--vscode-list-hoverBackground)",
} as const;

// CSS変数名のマッピング
export const CSS_VARIABLE_NAMES = {
  sidebarBackground: "--git-ui-sidebar-bg",
  sideBarForeground: "--git-ui-sidebar-fg",
  descriptionText: "--git-ui-description-fg",
  customBorder: "--git-ui-border",
  listHoverBackground: "--git-ui-hover-bg",
} as const;
