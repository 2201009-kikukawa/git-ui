import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

// VS Code APIの型定義
declare function acquireVsCodeApi(): {
  postMessage: (message: any) => void;
  getState: () => any;
  setState: (state: any) => void;
};

// VS Code APIのインスタンスを取得
const vscode = acquireVsCodeApi();

interface FileListResult {
  command: string;
  files?: string[];
  error?: string;
  respectGitignore?: boolean;
}

const main = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastMode, setLastMode] = useState<string>("");

  useEffect(() => {
    // VS Codeからのメッセージを受信
    const handleMessage = (event: MessageEvent) => {
      const message: FileListResult = event.data;

      if (message.command === "changedFilesResult") {
        setLoading(false);
        if (message.error) {
          setError(message.error);
          setFileList([]);
        } else {
          setError("");
          setFileList(message.files || []);
          setLastMode(message.respectGitignore ? "Gitignore考慮あり" : "Gitignore考慮なし");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleGetChangedFiles = (respectGitignore: boolean) => {
    setLoading(true);
    setError("");
    vscode.postMessage({
      command: "getChangedFiles",
      respectGitignore: respectGitignore,
    });
  };

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <h3>Git変更ファイル取得</h3>
        <VSCodeButton
          onClick={() => handleGetChangedFiles(true)}
          disabled={loading}
          style={{ marginRight: "10px" }}>
          Gitignore考慮あり
        </VSCodeButton>
        <VSCodeButton onClick={() => handleGetChangedFiles(false)} disabled={loading}>
          Gitignore考慮なし
        </VSCodeButton>
      </div>

      {loading && <div>取得中...</div>}

      {error && <div style={{ color: "red", marginBottom: "10px" }}>エラー: {error}</div>}

      {fileList.length > 0 && (
        <div>
          <h4>変更されたファイル ({lastMode}):</h4>
          <ul style={{ paddingLeft: "20px" }}>
            {fileList.map((file, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                {file}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
            合計: {fileList.length} ファイル
          </div>
        </div>
      )}

      {!loading && fileList.length === 0 && !error && lastMode && (
        <div style={{ color: "#888" }}>変更されたファイルはありません ({lastMode})</div>
      )}
    </>
  );
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));
