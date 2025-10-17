import React from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { EventListenerProps, EventTypes } from "../../types/classNames";

// VSCode API使用
declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();


const gitPullView: React.FC = () => {
  const handleAlert = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert
    });
  };

  return (
    <div className="section-wrap">
      <div className="main-section">
        <div className="header mt-4">
          <h1 className="wrap-text text-2xl font-bold">Git Pull</h1>
          <VSCodeButton className="submit-button" onClick={handleAlert}>実行</VSCodeButton>
        </div>
        <h3 className="text-base font-bold mt-4">ひとことで言うと？</h3>
        <hr className="my-2" />
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

export default gitPullView;

// ReactDOM でレンダリング
const initializeGitPullView = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitPullView));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGitPullView);
} else {
  initializeGitPullView();
}
