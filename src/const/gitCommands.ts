export interface GitCommand {
  key: string;
  command: string;
  description: string;
}

export const GIT_COMMANDS: GitCommand[] = [
  {
    key: "pull",
    command: "git pull",
    description: "リモートリポジトリから変更を取得してマージします",
  },
  {
    key: "add",
    command: "git add",
    description: "ファイルをステージングエリアに追加します",
  },
  {
    key: "commit",
    command: "git commit",
    description: "ステージされた変更をコミットします",
  },
  {
    key: "push",
    command: "git push",
    description: "ローカルの変更をリモートリポジトリにプッシュします",
  },
];
