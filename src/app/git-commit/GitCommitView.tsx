import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import { Dialog, DialogContent, DialogTrigger } from "../../components/Dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

const gitCommitView: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === EventTypes.changedFilesResult) {
        setError(message.error || "");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => removeEventListener("message", handleMessage);
  }, []);

  const handleDialogOpen = () => {
    setError("");
    setIsDialogOpen(true);
    vscode.postMessage({
      type: EventTypes.openDialog
    });
  };

  const handleAlert = () => {
    if (commitMessage.trim() === "") {
      setError("コミットメッセージを入力してください");
      return;
    } else {
      setCommitMessage("");
      setError("");
      vscode.postMessage({
        type: EventTypes.sendAlert,
        commitMessage: commitMessage
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="section-wrap px-4">
      <div className="main-section">
        <div className="header mt-4">
          <h1 className="wrap-text text-2xl font-bold">Git Commit</h1>
          <div>
            {/* モーダル */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleDialogOpen}>実行</Button>
              </DialogTrigger>
              <DialogContent className="grid-rows-[auto]" showCloseButton={false}>
                <DialogTitle className="text-2xl font-bold self-center">コミットメッセージ</DialogTitle>
                <Input type="text" className="self-center w-[95%] mx-auto" value={commitMessage} onChange={(e) => setCommitMessage(e.target.value)} />
                {error && <p className="text-[var(--vscode-editorError-foreground)] font-bold mt-2">{error}</p>}
                <div className="flex flex-wrap justify-end content-center gap-4">
                  <Button variant="secondary" onClick={() => { setIsDialogOpen(false); }}>キャンセル</Button>
                  <Button onClick={handleAlert}>コミット</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <h3 className="text-base font-bold mt-4">ひとことで言うと？</h3>
        <hr className="my-2" />
        <p>ローカルリポジトリ（自分のPC内）における変更内容を保存し、変更履歴として記録するためのコマンドです。作業中の変更を一区切りとしてまとめ、後からいつでもその状態に戻れるようにする記録のような役割を持ちます。</p>
      </div>

      <div className="sub-section">
        <div className="icon-area-wrap">
          <span className="codicon codicon-github-inverted git-icon"></span>
          <div className="icon-description">
            <p>リモートリポジトリ</p>
            <p>(GitHub)</p>
          </div>

          <div className="animation-container down-arrow">
            <div className="arrow"></div>
            <div className="arrow"></div>
            <div className="arrow"></div>
          </div>

          <span className="codicon codicon-vm vm-icon"></span>
          <div className="icon-description">
            <p className="icon-description">ステージングエリア</p>
            <p>(コミット前の待機エリア)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default gitCommitView;

const initialGitCommitView = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitCommitView));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialGitCommitView);
} else {
  initialGitCommitView();
}
