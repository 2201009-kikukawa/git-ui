import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import { Button } from "../../components/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/Collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/Dialog";

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

interface FileListResult {
  type: string;
  files?: string[];
  error?: string;
}

const gitAddView: React.FC = () => {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [fileList, setFileList] = useState<string[]>([]);
  const [stageList, setStageList] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message: FileListResult = event.data;

      if (message.type === EventTypes.changedFilesResult) {
        setLoading(false);
        setStageList([]);

        if (message.error) {
          setError(message.error);
          setFileList([]);
        } else {
          setError("");
          setFileList(message.files || []);
        }
      }

      if (message.type === EventTypes.complete) {
        setStageList([]);
        setIsDialogOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (stageList.length > 0) {
      setValidationError("");
    }
  }, [stageList]);

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
    setLoading(true);
    setError("");
    setValidationError("");
    vscode.postMessage({
      type: EventTypes.openDialog,
    });
    setIsDialogOpen(true);
  };

  const handleAddFile = (file: string) => {
    setStageList((prev) => (prev.includes(file) ? prev : [...prev, file]));
    setFileList((prev) => prev.filter((item) => item !== file));
  };

  const handleRemoveFile = (file: string) => {
    setFileList((prev) => (prev.includes(file) ? prev : [...prev, file]));
    setStageList((prev) => prev.filter((item) => item !== file));
  };

  const handleStageAll = () => {
    if (fileList.length === 0) {
      return;
    }
    setStageList((prev) => Array.from(new Set([...prev, ...fileList])));
    setFileList([]);
  };

  const handleResetSelection = () => {
    if (stageList.length === 0) {
      return;
    }
    setFileList((prev) => [...prev, ...stageList]);
    setStageList([]);
  };

  const handleExecute = () => {
    if (stageList.length === 0) {
      setValidationError("ステージするファイルを選択してください");
      return;
    }

    vscode.postMessage({
      type: EventTypes.sendAlert,
      files: stageList,
    });
  };

  return (
    <div className="section-wrap px-2 md:px-6 lg:px-10">
      <div className="main-section">
        <div className="header flex flex-col">
          <span className="codicon codicon-diff-added pull-icon"></span>
          <h1 className="wrap-text text-2xl font-bold">git add</h1>
        </div>

        <div className={`${content} mt-12 p-[16px] max-w-[800px]`}>
          <div>
            <h3 className="text-xl font-bold" id="description">
              ひとことで言うと？
            </h3>
            <hr className="my-2" />
            <p>
              ワーキングツリー（作業中の領域）で編集したファイルを、次のコミットに含める候補としてステージングエリアに登録するコマンドです。
              どの変更をコミットするのかを「点呼」するイメージで使用します。
            </p>
            <div className="icon-area-wrap-horizontal flex flex-row items-center justify-center gap-4 mt-6">
              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-vm vm-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    ワーキング
                    <br />
                    ツリー
                  </p>
                  <p className="hidden md:block">ワーキングツリー</p>
                  <p>(作業中のエリア)</p>
                </div>
              </div>

              <div className="animation-container-horizontal flex flex-row items-center justify-center">
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-git-commit git-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    ステージング
                    <br />
                    エリア
                  </p>
                  <p className="hidden md:block">ステージングエリア</p>
                  <p>(コミット待ちの控室)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="time">
              いつ使うの？
            </h3>
            <hr className="my-2" />
            <p>コミットする内容を決めるタイミングで実行します。</p>
            <ul className="list-disc ml-8 mt-4">
              <li>別々のコミットに分けたい変更を仕分けするとき</li>
              <li>レビューしやすい塊にまとめたいとき</li>
              <li>作業途中のファイルをコミットに含めたくないとき</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="example">
              具体例で見る実行の流れ
            </h3>
            <hr className="my-2" />
            <p>
              前提: <span className={code}>src/components/Header.tsx</span> と
              <span className={code}>README.md</span> をコミットしたいが、
              <span className={code}>docs/guide.md</span> はまだ作業途中です。
            </p>

            <p className="text-base font-bold mt-8">git add 実行前の状態</p>
            <p>すべての変更がワーキングツリーにあり、どれもステージされていません。</p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4"> M src/components/Header.tsx</p>
                <p className="pl-4"> M README.md</p>
                <p className="pl-4">?? docs/guide.md</p>
              </div>
            </div>

            <p className="text-base font-bold mt-8">git add 実行後の状態</p>
            <p>
              HeaderとREADMEをステージングエリアに移動しました。まだ触りたくない
              <span className={code}>docs/guide.md</span> はワーキングツリーに残ります。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git add src/components/Header.tsx README.md</p>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4 text-[#0FBC7A]">M src/components/Header.tsx</p>
                <p className="pl-4 text-[#0FBC7A]">M README.md</p>
                <p className="pl-4">?? docs/guide.md</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="success">
              どうなれば成功？
            </h3>
            <hr className="my-2" />
            <p>
              ステージングエリアへ移動した変更は、git status で緑色（Staged）として表示されます。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git add src/components/Header.tsx</p>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4 text-[#0FBC7A]"> M src/components/Header.tsx</p>
                <p className="pl-4"> M README.md</p>
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
                  fatal: pathspec 'feature/header.tsx' did not match any files
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
                  指定したファイルパスが存在しない、またはカレントディレクトリが異なるため、Gitが対象を見つけられていない状況です。
                </p>
                <p className="font-bold mt-4">解決策</p>
                <ol className="list-[upper-latin] ml-8 mt-4">
                  <li className="mt-2">
                    パスのスペルと階層を再確認する
                    <p>
                      例えば <span className={code}>src/components/Header.tsx</span>{" "}
                      のように、ルートからの相対パスで指定します。
                    </p>
                  </li>
                  <li className="mt-2">
                    カレントディレクトリを正しく移動する
                    <p>
                      <span className={code}>git status</span> で今いる場所を確認し、必要なら{" "}
                      <span className={code}>cd</span> で移動します。
                    </p>
                  </li>
                  <li className="mt-2">
                    パスにスペースがある場合は引用符で囲む
                    <p>
                      <span className={code}>git add "docs/My Guide.md"</span> のように指定します。
                    </p>
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
              <li>サイドバーのソース管理アイコンをクリック</li>
              <li>変更一覧からステージしたいファイルの「+」アイコンを押す</li>
              <li>複数ファイルをまとめてステージしたい場合はセクション右上の「+」を使用</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="sub-section flex flex-col">
        <div className={`${content} p-[16px] max-w-[300px]`}>
          <div className="execute-button-wrap">
            <Button className="submit-button cursor-pointer mx-auto" onClick={handleDialogOpen}>
              ファイルを選んでgit add
            </Button>
            <p className="execute-hint">クリック後にステージング用モーダルが開きます</p>
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
          className="min-h-0 w-[min(90vw,48rem)] gap-6 p-6">
          <div className="grid gap-4 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch">
            <div className="rounded-md border border-[var(--vscode-editorWidget-border)] p-4 flex flex-col min-h-[300px]">
              <div className="space-y-3 text-sm">
                <div className="rounded border border-[var(--vscode-editorWidget-border)] px-4 py-3 text-center">
                  <p className="text-[var(--vscode-descriptionForeground)] font-semibold">
                    ワーキングツリー
                  </p>
                  <p className="text-2xl font-bold tracking-tight">{fileList.length}</p>
                </div>
                <div className="rounded border border-[var(--vscode-editorWidget-border)] px-4 py-3 text-center">
                  <p className="text-[var(--vscode-descriptionForeground)] font-semibold">
                    ステージング
                  </p>
                  <p className="text-2xl font-bold tracking-tight">{stageList.length}</p>
                </div>
              </div>
              <p className="mt-auto text-xs text-[var(--vscode-descriptionForeground)] text-center">
                クリックで状態を更新
              </p>
            </div>

            <div className="rounded-md border border-[var(--vscode-editorWidget-border)] p-4 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold">STEP1 変更を選ぶ</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleStageAll}
                  disabled={fileList.length === 0}>
                  すべて追加
                </Button>
              </div>
              <div className="mt-3 max-h-[240px] overflow-y-auto text-start text-sm flex-1">
                {loading && <p>取得中...</p>}
                {error && (
                  <div>
                    <p className="text-[var(--vscode-editorError-foreground)] font-bold">エラー</p>
                    <p>{error}</p>
                  </div>
                )}
                {!loading && !error && fileList.length === 0 && (
                  <p>変更されたファイルはありません</p>
                )}
                {!loading && !error && fileList.length > 0 && (
                  <ul className="space-y-2">
                    {fileList.map((file) => (
                      <li
                        key={file}
                        className="flex items-center justify-between gap-2 rounded border border-transparent px-2 py-1 hover:border-[var(--vscode-editor-foreground)] cursor-pointer"
                        onClick={() => handleAddFile(file)}>
                        <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {file}
                        </p>
                        <span className="codicon codicon-add add-icon"></span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center min-h-[300px]">
              <div className="flex-1 flex items-center justify-center">
                <span className="codicon codicon-arrow-right arrow-right text-2xl"></span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="min-w-[96px]"
                onClick={handleResetSelection}
                disabled={stageList.length === 0}>
                リセット
              </Button>
            </div>

            <div className="rounded-md border border-[var(--vscode-editorWidget-border)] p-4 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between">
                <p className="font-semibold">STEP2 並びを確認</p>
                <span className="text-xs text-[var(--vscode-descriptionForeground)]">
                  クリックで戻せます
                </span>
              </div>
              <div className="mt-3 max-h-[240px] overflow-y-auto text-start text-sm flex-1">
                {stageList.length === 0 && <p>ここにステージ済みファイルが積み上がります</p>}
                {stageList.length > 0 && (
                  <ul className="space-y-2">
                    {stageList.map((file) => (
                      <li
                        key={file}
                        className="flex items-center justify-between gap-2 rounded border border-[var(--vscode-editor-foreground)] px-2 py-1 cursor-pointer"
                        onClick={() => handleRemoveFile(file)}>
                        <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          {file}
                        </p>
                        <span className="codicon codicon-chrome-minimize minimize-icon"></span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

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
            <Button
              className="min-w-[160px]"
              onClick={handleExecute}
              disabled={stageList.length === 0}>
              選択したファイルでgit add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default gitAddView;

const initialGitAddView = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitAddView));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialGitAddView);
} else {
  initialGitAddView();
}
