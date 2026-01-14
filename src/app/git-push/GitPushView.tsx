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

const gitPushView: React.FC = () => {
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      const uri = rootElement.getAttribute("data-image-uri");
      if (uri) {
        setImageUri(uri);
      }
    }
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

  const handleConfirm = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert,
    });
    setIsConfirmOpen(false);
  };

  return (
    <div className="section-wrap px-2 md:px-6 lg:px-10">
      <div className="main-section">
        <div className="header flex flex-col">
          <span className="codicon codicon-cloud-upload pull-icon"></span>
          <h1 className="wrap-text text-2xl font-bold">git push</h1>
        </div>

        <div className={`${content} mt-12 p-[16px] max-w-[800px]`}>
          <div>
            <h3 className="text-xl font-bold" id="description">
              ひとことで言うと？
            </h3>
            <hr className="my-2" />
            <p>
              ローカルリポジトリで作成したコミットを、リモートリポジトリ（GitHub
              など）へアップロードして共有するコマンドです。
              チーム全体に最新の変更を届ける最後のステップにあたります。
            </p>
            <div className="icon-area-wrap-horizontal flex flex-row items-center justify-center gap-4 mt-6">
              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-vm vm-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    ローカル
                    <br />
                    リポジトリ
                  </p>
                  <p className="hidden md:block">ローカルリポジトリ</p>
                  <p>(あなたのPC)</p>
                </div>
              </div>

              <div className="animation-container-horizontal flex flex-row items-center justify-center">
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
                <div className="arrow-horizontal"></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="codicon codicon-github-inverted git-icon"></span>
                <div className="icon-description">
                  <p className="md:hidden">
                    リモート
                    <br />
                    リポジトリ
                  </p>
                  <p className="hidden md:block">リモートリポジトリ</p>
                  <p>(GitHub)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="time">
              いつ使うの？
            </h3>
            <hr className="my-2" />
            <p>次のようなタイミングで実行します。</p>
            <ul className="list-disc ml-8 mt-4">
              <li>実装や修正をコミットした後、他メンバーと共有したいとき</li>
              <li>Pull Request を作成する前に、手元のブランチをリモートへ同期したいとき</li>
              <li>リリース用のブランチへ反映して CI/CD を走らせたいとき</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="example">
              具体例で見る実行の流れ
            </h3>
            <hr className="my-2" />
            <p>
              前提: <span className={code}>feature/header</span> ブランチで 2
              つのコミットを作成し、ローカルはリモートより 2 件先行しています。
            </p>

            <p className="text-base font-bold mt-8">git push 実行前の状態</p>
            <p>ローカルブランチが ahead 2 の状態で、まだ誰にも共有していません。</p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4">## feature/header...origin/feature/header [ahead 2]</p>
                <p>pc@user example-project % git log --oneline -2</p>
                <p className="pl-4">7cbb6ba Add animation to hero</p>
                <p className="pl-4">a0905f8 Fix typo in copy</p>
              </div>
            </div>

            <p className="text-base font-bold mt-8">git push 実行後の状態</p>
            <p>ローカルとリモートの履歴が一致し、Pull Request を作成できる状態になりました。</p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git push origin feature/header</p>
                <p className="pl-4">Enumerating objects: 8, done.</p>
                <p className="pl-4">Counting objects: 100% (8/8), done.</p>
                <p className="pl-4">Delta compression using up to 8 threads</p>
                <p className="pl-4">Writing objects: 100% (4/4), 1.21 KiB | 1.21 MiB/s, done.</p>
                <p className="pl-4">To https://github.com/demo-user/example-project.git</p>
                <p className="pl-4"> 1a2b3c4..7cbb6ba feature/header -&gt; feature/header</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="success">
              どうなれば成功？
            </h3>
            <hr className="my-2" />
            <p>
              push が成功すると、git status に「up to date」と表示され、GitHub
              上にも新しいコミットが並びます。
            </p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git status -sb</p>
                <p className="pl-4">## feature/header...origin/feature/header</p>
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
                  rejected – fetch first (non-fast-forward)
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
                  リモート側に新しいコミットが追加され、ローカル履歴が古いまま push
                  しようとしたため拒否されています。
                </p>
                <p className="font-bold mt-4">解決策</p>
                <ol className="list-[upper-latin] ml-8 mt-4">
                  <li className="mt-2">
                    まずリモートの変更を取り込む
                    <p>
                      <span className={code}>git pull --rebase</span> で履歴を最新にした後、再度
                      push します。
                    </p>
                  </li>
                  <li className="mt-2">
                    競合が出たらローカルで解決してから push
                    <p>
                      解消後は <span className={code}>git rebase --continue</span> で rebase
                      を完了します。
                    </p>
                  </li>
                  <li className="mt-2">
                    強制 push は最後の手段
                    <p>
                      <span className={code}>git push --force-with-lease</span>{" "}
                      を使う場合はチームに周知し、事故を防ぎます。
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
              <li>ソース管理ビューで、右上の「…」メニューを開く</li>
              <li>「プッシュ」を選択（または下向き矢印横の上矢印ボタンをクリック）</li>
              <li>初めてのリモートに push する場合は、リモート名とブランチ名を確認して実行</li>
            </ol>
            {imageUri && (
              <div className="mt-6">
                <img
                  src={imageUri}
                  alt="VSCode標準のGit拡張機能でのgit push手順"
                  className="w-full max-w-[800px] rounded-md border border-[var(--vscode-editorWidget-border)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sub-section flex flex-col">
        <div className={`${content} p-[16px] max-w-[300px]`}>
          <div className="execute-button-wrap">
            <Button
              className="submit-button cursor-pointer mx-auto"
              onClick={() => setIsConfirmOpen(true)}>
              Git Pushを実行
            </Button>
            <p className="execute-hint">クリック後に確認画面が開きます</p>
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

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent
          overlayClassName="bg-black/70"
          showCloseButton={false}
          className="min-h-0 w-[min(90vw,22rem)] gap-6 p-6 text-center">
          <DialogHeader className="flex justify-center">
            <DialogTitle className="text-lg font-semibold whitespace-nowrap">
              リモートへ push しますか？
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex gap-4">
            <Button
              variant="secondary"
              className="min-w-[96px]"
              onClick={() => setIsConfirmOpen(false)}>
              いいえ
            </Button>
            <Button className="min-w-[96px]" onClick={handleConfirm}>
              はい
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default gitPushView;

const initializeGitPushView = () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(gitPushView));
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGitPushView);
} else {
  initializeGitPushView();
}
