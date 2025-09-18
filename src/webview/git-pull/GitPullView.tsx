import React from "react";
import ReactDOM from "react-dom/client";

const GitPullView: React.FC = () => {
  return (
    <div className="section-wrap">
      <div className="main-section">
        <h1 className="wrap-text">Git Pull</h1>
        <h3>ひとことで言うと？</h3>
        <hr />
        <p>リモートリポジトリ（GitHub）の最新の変更を、ローカルリポジトリ（自分のPC）に適用させるためのコマンドです。共同で開発をする際に、他の人が更新した内容を取得するために使用します。</p>
      </div>
      <div className="sub-section">
        <div className="icon-area-wrap">
          <span className="codicon codicon-github-inverted git-icon"></span>
          <div className="icon-description">
            <p>リモートリポジトリ</p>
            <p>(GitHub)</p>
          </div>

          <div className="animation-container">
            <div className="arrow"></div>
            <div className="arrow"></div>
            <div className="arrow"></div>
          </div>

          <span className="codicon codicon-vm vm-icon"></span>
          <div className="icon-description">
            <p className="icon-description">ローカルリポジトリ</p>
            <p>(PC)</p>
          </div>
        </div>

      </div>
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
