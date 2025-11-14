import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { EventListenerProps, EventTypes } from "../../types/classNames";
import { Button } from "../../components/Button";

// VSCode API使用
declare const acquireVsCodeApi: () => {
  postMessage: (message: EventListenerProps) => void;
};
const vscode = acquireVsCodeApi();

const code = "text-[var(--vscode-editorInfo-foreground)] bg-[var(--vscode-editor-hoverHighlightBackground)] rounded-md mx-2 px-1";
const codeArea = "rounded-b-lg rounded-tr-lg bg-[var(--vscode-editor-hoverHighlightBackground)] p-4";
const codeTitle = "rounded-t-lg bg-[var(--vscode-editor-hoverHighlightBackground)] px-4 pb-1 pt-2 text-[var(--vscode-editorHint-foreground)] w-fit";

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
  ];
  const activeId = useActiveSection(sections.map(section => section.id));

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

  return (
    <div className="section-wrap pl-4">

      {/* メインエリア */}
      <div className="main-section">
        <div className="header flex flex-col">
          <span className="codicon codicon-repo-pull pull-icon"></span>
          <h1 className="wrap-text text-2xl font-bold">git pull</h1>
        </div>

        <div className="bg-[var(--vscode-textBlockQuote-background)] mt-12 px-4 py-6 rounded-md border-1 border-[var(--vscode-editorWidget-border)]">
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
                <p className="pl-4 bg-[var(--vscode-editorGutter-addedSecondaryBackground)]">  └── example.txt ←追加された</p>
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
                <p className="pl-4">From https://github.com/demo-user/exaple-project</p>
                <p className="pl-8">a0905f8..7cbb6ba  main       -&gt; origin/main</p>
                <p className="pl-4">Updating a0905f8..7cbb6ba</p>
                <p className="pl-8">README.md                           |  57 <span className="text-[var(--vscode-gitDecoration-untrackedResourceForeground)]">+++++++++++++++++++++++++</span></p>
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
        </div>
      </div>

      {/* サブエリア */}
      <div className="sub-section px-4 md:px-12 h-[100vh] sticky top-0 grid grid-rows-[auto_2fr_3fr] gap-6">
        <div className="sticky top-0 bg-[var(--vscode-editor-background)] px-2 pt-8 pb-4 z-10 justify-self-center">
          <Button className="submit-button" onClick={handleAlert}>Git Pullを実行</Button>
        </div>

        {/* 目次 */}
        <div className="overflow-y-auto bg-[var(--vscode-textBlockQuote-background)] p-4 rounded-md border-1 border-[var(--vscode-editorWidget-border)]">
          <h3 className="text-base font-bold mt-4">目次</h3>
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
        <div className="overflow-y-auto bg-[var(--vscode-textBlockQuote-background)] p-4 rounded-md border-1 border-[var(--vscode-editorWidget-border)]">
          <div className="icon-area-wrap">
            <span className="codicon codicon-github-inverted git-icon"></span>
            <div className="icon-description">
              <p>リモートリポジトリ</p>
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
              <p className="icon-description">ローカルリポジトリ</p>
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
