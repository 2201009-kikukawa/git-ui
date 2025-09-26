import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import React from "react";
import ReactDOM from "react-dom/client";

declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

const gitAddView: React.FC = () => {
  const handleAlert = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert
    });
  };

  return (
    <div className="section-wrap">
      <div className="main-section">
        <div className="header">
          <h1 className="wrap-text">Git Add</h1>
          <VSCodeButton className="submit-button" onClick={handleAlert}>実行</VSCodeButton>
        </div>
        <h3>ひとことで言うと？</h3>
        <hr />
        <p>ワーキングツリー（作業中のエリア）の中で、次にコミットするファイルを選んで登録するためのコマンドです。ステージングエリア（コミット前の待機エリア）にどの変更を適用するか選択するために使用します。</p>
      </div>
      <div className="sub-section">
        <div className="icon-area-wrap">
          <span className="codicon codicon-vm git-icon"></span>
          <div className="icon-description">
            <p>ステージングエリア</p>
            <p>(コミット前の待機エリア)</p>
          </div>

          <div className="animation-container down-arrow">
            <div className="arrow"></div>
            <div className="arrow"></div>
            <div className="arrow"></div>
          </div>

          <span className="codicon codicon-vm vm-icon"></span>
          <div className="icon-description">
            <p>ワーキングツリー</p>
            <p>(作業中のエリア)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default gitAddView;

const initialGitAddView = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitAddView));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialGitAddView);
} else {
  initialGitAddView();
}
