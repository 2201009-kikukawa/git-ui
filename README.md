# Git Box - Visual Git Assistant

長時間のコーディングでも Git 操作でつまずかないよう、`Git Box` は VS Code 内で主要な Git コマンドを視覚的に案内する学習型拡張機能です。コマンドの背景解説と操作ガイドを同じ画面で確認し、必要に応じてそのままターミナル実行・モーダル入力まで完結できます。

![Git Box パネルの差し替え場所](media/panel-demo.gif)
![Git Box サイドバーの差し替え場所](media/git-pull-demo.gif)

## 主な機能

- **Git Box ビュー**: アクティビティバーに追加される `Git Box` から `git pull / add / commit / push` の 4 コマンドをカード表示。クリックすると専用タブを自動生成します。
- **ガイド付き Git Add**: VS Code Git API から変更ファイルを取得し、ステージ対象をドラフト/ステージ一覧で入れ替えながら `git add` を実行。複数選択や一括リセット、成功通知までモーダル内で完了します。
- **コミットメッセージパネル**: `git add` 済みファイルを検知し、メッセージバリデーション付きの入力モーダルから `git commit -m` を送信。未ステージ状態では警告を返します。
- **Pull / Push コンパニオン**: 実行前に確認ダイアログを挟み、VS Code のターミナルへ `git pull` / `git push` を送信。Pull ビューはスクリーンショットとエラー解説、Push ビューはリジェクト時の再学習ポイントを提供します。
- **学習カード**: それぞれのビューに「いつ使うのか」「成功状態」「VS Code 標準 UI での操作手順」を収録し、実務と学習を往復できます。
- **VS Code テーマ連動**: `src/app/sidebar/main.tsx` で VS Code のテーマカラーを CSS 変数へ反映し、ライト/ダークの切り替えに追従します。

## インストール

1. VS Code v1.93.1 以降を用意します。
2. VS Code Marketplace で `Git Box` を検索してインストールします。
3. アクティビティバーに Git Box のアイコンが表示されれば準備完了です。

## 使い方

### Git Box ビュー

1. アクティビティバーから `Git Box` を開きます。
2. 一覧に並ぶ Git コマンドカードから実行したい項目をクリックします。
3. 対応する Webview タブが開き、ガイドと操作パネルを利用できます。

### Git Add ワークフロー

- `ファイルを選んでgit add` ボタンでモーダルを表示し、ワーキングツリーの変更を取得します。
- 右側のステージングリストへドラフトファイルを移動し、`Git Add を実行` でコマンドを送信します。
- 完了すると VS Code の通知とともにステージリストがリセットされます。

### Git Commit パネル

- `コミットメッセージを入力` をクリックして入力モーダルを開きます。
- メッセージを入力するとバリデーションが解除され、`コミットする` を押すと `git commit -m` を実行します。
- 未ステージの場合はエラーガイドを参考に `git add` へ戻れます。

### Git Pull / Push アシスト

- Pull ビューは `Git Pullを実行` から確認ダイアログを経てコマンドを送信。作業中の変更がある場合はエラー対処法や `git commit` リンクから関連ビューへ遷移できます。
- Push ビューは `Git Pushを実行` 後に最終確認を表示し、`git push` をターミナルへ送ります。リジェクト時の再学習ポイントも同じカードで確認できます。

## 技術メモ

- Webview UI は React 19 + TypeScript + Tailwind CSS で構築し、Radix UI コンポーネントと VS Code Codicon を併用しています。
- `src/const/gitCommands.ts` でサイドバーに並べるコマンドと説明文を一元管理できます。
- Git 処理は VS Code 付属 Git 拡張の API を利用し、フォールバックとして統合ターミナルへ直接コマンドを送信します。

## 開発者向け

```bash
npm install      # 依存関係のインストール
npm run watch    # CSS/JS の監視ビルド
npm run compile  # 配布用バンドル生成
```

`npm run watch` は `postcss` と `esbuild` を並列起動するため、Webview を開いたままホットリロード感覚で開発できます。

## ライセンス / コントリビュート

- **バグ報告・機能要望**: [GitHub Issues](https://github.com/kazuki0903/git-box-extension/issues) へお寄せください。
- **コントリビュート**: 開発への参加を歓迎します！詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) をご確認ください。
- **プルリクエスト**: 送信前に `npm run compile` が通ること、および挙動に問題がないことを確認してください。

---

Git Box と一緒に、Git の基本フローを視覚化しながら快適なコーディング体験を手に入れましょう。
