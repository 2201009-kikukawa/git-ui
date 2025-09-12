import React from "react";
import ReactDOM from "react-dom/client";

const GitPullView: React.FC = () => {
  return (
    <div style={{ padding: "16px" }}>
      <h2>Git Pull</h2>
      <p>ここに git pull コマンドの詳細やUIを実装できます。</p>
      <button
        style={{
          padding: "8px 16px",
          backgroundColor: "var(--vscode-button-background)",
          color: "var(--vscode-button-foreground)",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}>
        Pull実行
      </button>
    </div>
  );
};

export default GitPullView;

// ReactDOM でレンダリング
const initializeGitPullView = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(GitPullView));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGitPullView);
} else {
  initializeGitPullView();
}
