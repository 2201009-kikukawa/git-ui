import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import { Button } from "../../components/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../components/Collapsible";

// VSCode API使用
declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

const code = "text-[var(--vscode-editorInfo-foreground)] bg-[var(--vscode-editor-hoverHighlightBackground)] rounded-md mx-2 px-1";
const codeArea = "rounded-b-lg rounded-tr-lg bg-[#232B35] text-[#FFFFFF] p-4";
const codeTitle = "rounded-t-lg bg-[#333E52] px-4 pb-1 pt-2 text-[#FFFFFF] w-fit";
const content = "bg-[var(--vscode-textBlockQuote-background)] rounded-md border-1 border-[var(--vscode-editorWidget-border)] justify-self-center w-full";

const useActiveSection = (sectionIds: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const triggerLine = window.innerHeight * 0.3;
      let closestId: string | null = null;

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) { return; }

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

const gitPullView: React.FC = () => {
  const sections = [
    { id: "description", title: "ひとことで言うと？" },
    { id: "time", title: "いつ使うの？" },
    { id: "example", title: "具体例で見る実行の流れ" },
    { id: "success", title: "どうなれば成功？" },
    { id: "error", title: "よくあるエラーと解決策" },
    { id: "vscode-git", title: "VSCode標準のGit拡張機能の場合の実行方法" },
  ];
  const activeId = useActiveSection(sections.map(section => section.id));
  const [isOpen, setIsOpen] = useState<boolean[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) { return; }

    const rect = el.getBoundingClientRect();
    const offset = window.innerHeight * 0.2;
    const targetY = window.scrollY + rect.top - offset;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  };

  const handleAlert = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert
    });
  };

  const handleCommitLinkClick = () => {
    vscode.postMessage({
      type: EventTypes.sendAlert,
      file: "commit"
    });
  };

  return (
    <div className="section-wrap pl-4">

      {/* メインエリア */}
      <div className="main-section">
        <div className="header flex flex-col">
          <span className="codicon codicon-repo-pull pull-icon"></span>
          <h1 className="wrap-text text-2xl font-bold">git pull</h1>
        </div>

        <div className={`${content} mt-12 p-[16px] max-w-[800px]`}>
          <div>
            <h3 className="text-xl font-bold" id="description">ひとことで言うと？</h3>
            <hr className="my-2" />
            <p>リモートリポジトリ（GitHub）の最新の状態を、ローカルリポジトリ（自分のPC）にダウンロードするコマンドです。</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="time">いつ使うの？</h3>
            <hr className="my-2" />
            <p>git pull は、自分の作業を始める前に「まずは最新の状態にしておこう」という習慣をつけるのがおすすめです。</p>
            <ul className="list-disc ml-8 mt-4">
              <li>朝、作業を開始するとき</li>
              <li>他の人が作業を終えた連絡を受けたとき</li>
              <li>新しい機能の開発に着手する直前</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="example">具体例で見る全体の流れ</h3>
            <hr className="my-2" />
            <p>前提: ついさっき、Aさんが<span className={code}>example.txt</span>というファイルを作成し、リモートリポジトリにプッシュしました。</p>

            <p className="text-base font-bold mt-8">git pull 実行前の状態</p>
            <p>あなたのローカルリポジトリには<span className={code}>example.txt</span>は存在しません。</p>

            <div className="mt-6">
              <p className={codeTitle}>ローカルリポジトリのディレクトリ構成図</p>
              <div className={codeArea}>
                <p>└── example-project/</p>
                <p className="pl-4">  └── README.md</p>
              </div>
            </div>

            <p className="text-base font-bold mt-8">git pull 実行後の状態</p>
            <p><span className={code}>example.txt</span>をローカルリポジトリにダウンロードしました。</p>

            <div className="mt-6">
              <p className={codeTitle}>ローカルリポジトリのディレクトリ構成図</p>
              <div className={codeArea}>
                <p>└── example-project/</p>
                <p className="pl-4">  ├── README.md</p>
                <p className="px-4 bg-[#1B3C36] w-fit">  └── example.txt ←追加された</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="success">どうなれば成功？</h3>
            <hr className="my-2" />
            <p>リモートリポジトリからダウンロードできるファイルが存在する場合は、git pull 実行時に以下のようにターミナルに表示されます。</p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git pull</p>
                <p className="pl-4">remote: Enumerating objects: 13, done.</p>
                <p className="pl-4">remote: Counting objects: 100% (6/6), done.</p>
                <p className="pl-4">remote: Compressing objects: 100% (3/3), done.</p>
                <p className="pl-4">remote: Total 13 (delta 2), reused 5 (delta 2), pack-reused 7 (from   1)</p>
                <p className="pl-4">Unpacking objects: 100% (13/13), 4.64 KiB | 431.00 KiB/s, done.</p>
                <p className="pl-4">From https://github.com/demo-user/example-project</p>
                <p className="pl-8">a0905f8..7cbb6ba  main       -&gt; origin/main</p>
                <p className="pl-4">Updating a0905f8..7cbb6ba</p>
                <p className="pl-8">README.md                           |  57 <span className="text-[#0FBC7A]">+++++++++++++++++++++++++</span></p>
                <p className="pl-4">2 files changed, 225 insertions(+), 186 deletions(-)</p>
                <p className="pl-4">create mode 100644 src/example.txt</p>
                <p className="pl-4">delete mode 100644 src/delete.txt</p>
                <p>pc@user example-project % </p>
              </div>
            </div>

            <p className="mt-8">リモートリポジトリからダウンロードできるファイルが存在しない（リモートとローカルで差分がない）場合は、すでに最新であるという旨のメッセージがターミナルに表示されます。</p>

            <div className="mt-6">
              <p className={codeTitle}>ターミナル（zsh）</p>
              <div className={codeArea}>
                <p>pc@user example-project % git pull</p>
                <p className="pl-4">Already up to date.</p>
                <p>pc@user example-project %</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mt-12" id="error">よくあるエラーと解決策</h3>
            <hr className="my-2" />
            <Collapsible open={isOpen[0]} onOpenChange={(open) => {
              const newIsOpen = [...isOpen];
              newIsOpen[0] = open;
              setIsOpen(newIsOpen);
            }}>
              <CollapsibleTrigger>
                <p className="flex items-center gap-2 cursor-pointer truncate">
                  Your local changes to the following files would be overwritten by merge:
                  {isOpen[0] ? <span className="codicon codicon-chevron-up"></span> : <span className="codicon codicon-chevron-down"></span>}
                </p>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="font-bold mt-4">原因</p>
                <p>コミットしていない変更（作業中の変更）がローカルに存在し、pull しようとしているリモートの変更と競合するため、Gitが「作業内容が消えてしまう危険がある」と判断して処理を停止している状況です。</p>
                <p className="font-bold mt-4">解決策</p>
                <p>以下のいずれかの方法で、作業中の変更を整理してから再度git pull を実行します。</p>
                <ol className="list-[upper-latin] ml-8 mt-4">
                  <li className="mt-2">
                    変更を一時退避する（推奨）
                    <p>git stashコマンドで、作業中の変更を一時的に保存します。</p>
                    <p className="w-fit cursor-pointer hover:underline text-[var(--vscode-textLink-foreground)]">git stashについてはこちら</p>
                  </li>
                  <li className="mt-2">
                    変更をコミットする
                    <p>作業中の変更がキリのいいところであれば、コミットしてしまいます。</p>
                    <p className="w-fit cursor-pointer hover:underline text-[var(--vscode-textLink-foreground)]" onClick={handleCommitLinkClick}>git commitについてはこちら</p>
                  </li>
                  <li className="mt-2">
                    変更を破棄する
                    <p>作業中のローカルの変更が不要な場合は、削除してしまいましょう。</p>
                  </li>
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold mt-12" id="vscode-git">VSCode標準のGit拡張機能の場合の実行方法</h3>
            <hr className="my-2" />
            <ol className="list-decimal ml-4 mt-4">
              <li>VSCode左のサイドバーからソース管理のアイコンを選択</li>
              <li>「...」をクリックしてメニューを表示</li>
              <li>「プル」をクリック</li>
            </ol>
          </div>

        </div>
      </div>

      {/* サブエリア */}
      <div className="sub-section px-4 md:px-12 h-[100vh] sticky top-0 grid grid-rows-[auto_2fr_3fr] gap-6">
        <div className={`${content} sticky top-0 p-[16px] mt-4 z-10 max-w-[300px]`}>
          <Button className="submit-button w-full cursor-pointer" onClick={handleAlert}>Git Pullを実行</Button>
        </div>

        {/* 目次 */}
        <div className={`${content} p-[16px] overflow-y-auto max-w-[300px]`}>
          <h3 className="text-base font-bold">目次</h3>
          <hr className="my-2" />
          {sections.map(({ id, title }) => (
            <a
              key={id}
              onClick={(e) => handleClick(e, id)}
              className={`block px-4 py-1 rounded transition-colors duration-200 cursor-pointer truncate
                ${activeId === id
                  ? "font-medium"
                  : "text-[var(--vscode-descriptionForeground)] hover:underline"
                }`}
            >
              {title}
            </a>
          ))}
        </div>

        {/* アイコンエリア */}
        <div className={`${content} p-[16px] overflow-y-auto max-w-[300px]`}>
          <p className="text-base font-bold mt-4 mb-8 text-center">動作イメージ</p>
          <div className="icon-area-wrap flex flex-col items-center justify-center gap-2">
            <span className="codicon codicon-github-inverted git-icon"></span>
            <div className="icon-description">
              <p className="md:hidden">リモート<br />リポジトリ</p>
              <p className="hidden md:block">リモートリポジトリ</p>
              <p>(GitHub)</p>
            </div>

            {/* 矢印 */}
            <div className="animation-container">
              <div className="arrow"></div>
              <div className="arrow"></div>
              <div className="arrow"></div>
            </div>

            <span className="codicon codicon-vm vm-icon"></span>
            <div className="icon-description">
              <p className="md:hidden">ローカル<br />リポジトリ</p>
              <p className="hidden md:block">ローカルリポジトリ</p>
              <p>(PC)</p>
            </div>
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
