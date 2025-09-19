export interface GitCommand {
  key: string;
  command: string;
  description: string;
}

export const GIT_COMMANDS = {
  pull: {
    key: "pull",
    command: "git pull",
    description: "リモートリポジトリから変更を取得してマージします",
  },
  add: {
    key: "add",
    command: "git add",
    description: "ファイルをステージングエリアに追加します",
  },
  commit: {
    key: "commit",
    command: "git commit",
    description: "ステージされた変更をコミットします",
  },
  push: {
    key: "push",
    command: "git push",
    description: "ローカルの変更をリモートリポジトリにプッシュします",
  },
} as const;

// 配列形式も必要な場合のために追加
export const GIT_COMMANDS_ARRAY: GitCommand[] = Object.values(GIT_COMMANDS);
