export const VSCODE_THEME_COLORS = {
  sidebarBackground: "var(--vscode-sideBar-background)",
  sideBarForeground: "var(--vscode-sideBar-foreground)",
  descriptionText: "var(--vscode-descriptionForeground)",
  customBorder: "var(--vscode-widget-border)",
  listHoverBackground: "var(--vscode-list-hoverBackground)",
} as const;

// CSS変数名のマッピング
export const CSS_VARIABLE_NAMES = {
  sidebarBackground: "--git-box-sidebar-bg",
  sideBarForeground: "--git-box-sidebar-fg",
  descriptionText: "--git-box-description-fg",
  customBorder: "--git-box-border",
  listHoverBackground: "--git-box-hover-bg",
} as const;
