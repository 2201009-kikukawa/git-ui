import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import { Button } from "../../components/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/Collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/Dialog";
import { Input } from "../../components/Input";

declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

const code =
  "text-[#FFFFFF] bg-[var(--vscode-editor-hoverHighlightBackground)] rounded-md mx-2 px-1";
const codeArea = "rounded-b-lg rounded-tr-lg bg-[#232B35] text-[#FFFFFF] p-4";
const codeTitle = "rounded-t-lg bg-[#333E52] px-4 pb-1 pt-2 text-[#FFFFFF] w-fit";
const content =
  "bg-[var(--vscode-textBlockQuote-background)] rounded-md border-1 border-[var(--vscode-editorWidget-border)] justify-self-center w-full";

const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const triggerLine = window.innerHeight * 0.3;
      let closestId: string | null = null;

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) {
          return;
        }

        const rect = el.getBoundingClientRect();

        if (rect.top <= triggerLine) {
          closestId = id;
        }
      });

      setActiveId(closestId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeId;
};

const gitCommitView: React.FC = () => {
  const sections = [
    { id: "description", title: "ひとことで言うと？" },
    { id: "time", title: "いつ使うの？" },
    { id: "example", title: "具体例で見る実行の流れ" },
    { id: "success", title: "どうなれば成功？" },
    { id: "error", title: "よくあるエラーと解決策" },
    { id: "vscode-git", title: "VSCode標準のGit拡張機能の場合の実行方法" },
  ];
  const activeId = useActiveSection(sections.map((section) => section.id));
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === EventTypes.changedFilesResult) {
        setError(message.error || "");
      }

      if (message.type === EventTypes.complete) {
        setIsDialogOpen(false);
        setCommitMessage("");
        setValidationError("");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const offset = window.innerHeight * 0.2;
    const targetY = window.scrollY + rect.top - offset;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  const handleDialogOpen = () => {
    setValidationError("");
    setError("");
    vscode.postMessage({
      type: EventTypes.openDialog,
    });
    setIsDialogOpen(true);
  };

  const handleCommit = () => {
    if (commitMessage.trim() === "") {
      setValidationError("コミットメッセージを入力してください");
      return;
    }

    vscode.postMessage({
      type: EventTypes.sendAlert,
      commitMessage,
    });
  };

  return (
    <div className="section-wrap px-2 md:px-6 lg:px-10">
      <div className="main-section">
        <div className="header flex flex-col">
          <span className="codicon codicon-diff pull-icon"></span>
          <h1 className="wrap-text text-2xl font-bold">git commit</h1>
        </div>

        <div className={`${content} mt-12 p-[16px] max-w-[800px]`}>
          <div>
            <h3 className="text-xl font-bold" id="description">
              ひとことで言うと？
            </h3>
            <hr className="my-2" />
            <p>
              ステージングエリアに並べた変更をひとかたまりの履歴（コミット）としてローカルリポジトリに記録するコマンドです。
              git add で選んだ内容にタイトル（コミットメッセージ）を付けて保存するイメージです。
            </p>
            <div className="icon-area-wrap-horizontal flex flex-row items-center justify-center gap-4 mt-6">
              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-git-commit git-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    ステージング
                    <br />
                    エリア
                  </p>
                  <p className="hidden md:block">ステージングエリア</p>
                  <p>(git add 済みの変更)</p>
                </div>
              </div>

              <div className="animation-container-horizontal flex flex-row items-center justify-center">
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-repo vm-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    ローカル
                    <br />
                    リポジトリ
                  </p>
                  <p className="hidden md:block">ローカルリポジトリ</p>
                  <p>(コミット履歴)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="time">
              いつ使うの？
            </h3>
            <hr className="my-2" />
            <p>以下のように作業の区切りができたタイミングで実行します。</p>
            <ul className="list-disc ml-8 mt-4">
              <li>機能を1つ作り終えた／バグを1つ直し終えたとき</li>
              <li>コードレビュー用に手元の変更を共有したいとき</li>
              <li>大きな作業を分割し、途中経過を記録しておきたいとき</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="example">
              具体例で見る実行の流れ
            </h3>
            <hr className="my-2" />
            <p>
              前提: <span className={code}>git add</span> で<span className={code}>Header.tsx</span>{" "}
              と<span className={code}>styles.css</span> をステージ済みです。
            </p>

            <p className="text-base font-bold mt-8">git commit 実行前の状態</p>
            <p>
              ステージングエリアには2つのファイルが並び、ワーキングツリーにはコミットしたくないドラフトが残っています。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4 text-[#0FBC7A]">M src/components/Header.tsx</p>
                <p className="pl-4 text-[#0FBC7A]">M src/styles.css</p>
                <p className="pl-4"> M docs/draft.md</p>
              </div>
            </div>

            <p className="text-base font-bold mt-8">git commit 実行後の状態</p>
            <p>
              ステージされていた2ファイルがローカル履歴に保存され、ワーキングツリーはドラフトだけになります。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git commit -m "Add hero header"</p>
                <p className="pl-4">2 files changed, 42 insertions(+), 5 deletions(-)</p>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4"> M docs/draft.md</p>
                <p>pc@user example-project %</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="success">
              どうなれば成功？
            </h3>
            <hr className="my-2" />
            <p>
              コミットが成功すると、git log に新しい履歴が追加され、git status は clean になります。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git log --oneline -1</p>
                <p className="pl-4">7cbb6ba Add hero header</p>
                <p>pc@user example-project % git status</p>
                <p className="pl-4">On branch main</p>
                <p className="pl-4">nothing to commit, working tree clean</p>
                <p>pc@user example-project %</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="error">
              よくあるエラーと解決策
            </h3>
            <hr className="my-2" />
            <Collapsible
              open={!!isOpen[0]}
              onOpenChange={(open) => {
                const newIsOpen = [...isOpen];
                newIsOpen[0] = open;
                setIsOpen(newIsOpen);
              }}>
              <CollapsibleTrigger>
                <p className="flex items-center gap-2 cursor-pointer truncate">
                  nothing to commit, working tree clean
                  {isOpen[0] ? (
                    <span className="codicon codicon-chevron-up"></span>
                  ) : (
                    <span className="codicon codicon-chevron-down"></span>
                  )}
                </p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="font-bold mt-4">原因</p>
                <p>
                  ステージングエリアに変更が存在しないため、記録するものがなくGitが処理を終了しています。
                </p>
                <p className="font-bold mt-4">解決策</p>
                <ol className="list-[upper-latin] ml-8 mt-4">
                  <li className="mt-2">
                    コミットしたい変更を git add でステージ
                    <p>
                      必要に応じて <span className={code}>git add -p</span>{" "}
                      で部分的に選ぶこともできます。
                    </p>
                  </li>
                  <li className="mt-2">
                    直前のコミットを修正したい場合は{" "}
                    <span className={code}>git commit --amend</span>
                    <p>ただし共同作業で共有済みの履歴を改変しないよう注意します。</p>
                  </li>
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold mt-12" id="vscode-git">
              VSCode標準のGit拡張機能の場合の実行方法
            </h3>
            <hr className="my-2" />
            <ol className="list-decimal ml-4 mt-4">
              <li>サイドバーのソース管理を開き、必要なファイルをステージする</li>
              <li>「メッセージ」欄にコミットメッセージを入力</li>
              <li>
                入力欄上のチェックマークボタン、または <span className={code}>Ctrl/⌘ + Enter</span>{" "}
                でコミット
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="sub-section flex flex-col">
        <div className={`${content} p-[16px] max-w-[300px]`}>
          <div className="execute-button-wrap">
            <Button className="submit-button cursor-pointer mx-auto" onClick={handleDialogOpen}>
              コミットメッセージを入力
            </Button>
            <p className="execute-hint">クリック後に入力モーダルが開きます</p>
          </div>
        </div>

        <div className={`${content} p-[16px] max-w-[300px]`}>
          <h3 className="text-base font-bold">目次</h3>
          <hr className="my-2" />
          {sections.map(({ id, title }) => (
            <a
              key={id}
              onClick={(e) => handleClick(e, id)}
              className={`block px-4 py-1 rounded transition-colors duration-200 cursor-pointer truncate
                ${
                  activeId === id
                    ? "font-medium"
                    : "text-[var(--vscode-descriptionForeground)] hover:underline"
                }`}>
              {title}
            </a>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          overlayClassName="bg-black/70"
          showCloseButton={false}
          className="min-h-0 w-[min(90vw,26rem)] gap-6 p-6 text-center">
          <DialogHeader className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold">コミットメッセージ</DialogTitle>
            <p className="text-sm text-[var(--vscode-descriptionForeground)]">
              変更内容を端的に説明する1文を入力してください。
            </p>
          </DialogHeader>
          <Input
            type="text"
            placeholder="例: Add hero header"
            value={commitMessage}
            onChange={(e) => {
              setCommitMessage(e.target.value);
              setValidationError("");
            }}
          />
          {(validationError || error) && (
            <p className="text-[var(--vscode-editorError-foreground)] font-bold">
              {validationError || error}
            </p>
          )}
          <DialogFooter className="flex gap-4">
            <Button
              variant="secondary"
              className="min-w-[96px]"
              onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button className="min-w-[120px]" onClick={handleCommit}>
              コミットする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default gitCommitView;

const initialGitCommitView = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitCommitView));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialGitCommitView);
} else {
  initialGitCommitView();
}
