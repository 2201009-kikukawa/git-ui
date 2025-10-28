import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/Dialog";
import { Button } from "../../components/Button";

declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

interface FileListResult {
  type: string;
  files?: string[];
  error?: string;
}

const gitAddView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [fileList, setFileList] = useState<string[]>([]);
  const [addFileList, setAddFileList] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message: FileListResult = event.data;

      if (message.type === EventTypes.changedFilesResult) {
        setLoading(false);
        setAddFileList([]);

        if (message.error) {
          setError(message.error);
          setFileList([]);
        } else {
          setError("");
          setFileList(message.files || []);
        }
      }

      if (message.type === EventTypes.complete) {
        setAddFileList([]);
        setIsDialogOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => removeEventListener("message", handleMessage);
  }, []);

  const handleDialogOpen = () => {
    vscode.postMessage({
      type: EventTypes.openDialog
    });
    setIsDialogOpen(true);
  };

  const handleAlert = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert,
      files: addFileList
    });
  };

  return (
    <div className="section-wrap px-4">
      <div className="main-section">
        <div className="header mt-4">
          <h1 className="wrap-text text-2xl font-bold">Git Add</h1>
          <div>
            <Button size="sm" className="submit-button" onClick={handleDialogOpen}>選択</Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="grid-rows-[1fr_auto]" showCloseButton={false}>
                <DialogHeader>
                  <div className="col-span-3 min-h-0 flex flex-col">
                    <DialogTitle>ワーキングツリー</DialogTitle>
                    <DialogDescription className="flex-1 min-h-0 overflow-y-auto">
                      {loading && <div>取得中...</div>}
                      {error && (
                        <div>
                          <div className="text-[var(--vscode-editorError-foreground)] mb-2 font-bold">エラー</div>
                          <div className="text-start">{error}</div>
                        </div>
                      )}

                      {fileList.length > 0 && (
                        <div className="text-start">
                          <ul className="h-full">
                            {fileList.map((file, index) => (
                              <li key={index} className="flex justify-between" onClick={() => {
                                setAddFileList([...addFileList, file]);
                                setFileList(fileList.filter(f => f !== file));
                              }}>
                                <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">{file}</p>
                                <span className="codicon codicon-add add-icon self-end ml-2"></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {!loading && fileList.length === 0 && !error && (
                        <div>変更されたファイルはありません</div>
                      )}
                    </DialogDescription>
                  </div>
                  <div className="self-center">
                    <span className="codicon codicon-arrow-right arrow-right"></span>
                  </div>
                  <div className="col-span-3 min-h-0 flex flex-col">
                    <DialogTitle>ステージングエリア</DialogTitle>
                    <DialogDescription className="flex-1 min-h-0 overflow-y-auto">
                      <div>
                        <ul className="h-full">
                          {addFileList.map((file, index) => (
                            <li key={index} className="flex justify-between" onClick={() => {
                              setFileList([...fileList, file]);
                              setAddFileList(addFileList.filter(f => f !== file));
                            }}>
                              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">{file}</p>
                              <span className="codicon codicon-chrome-minimize minimize-icon self-end ml-2"></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <DialogFooter>
                  <Button className="w-18" onClick={handleAlert}>実行</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <h3 className="text-base font-bold mt-4">ひとことで言うと？</h3>
        <hr className="my-2" />
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
    </div >
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
