import { ExtensionContext } from "vscode";

// Git コマンド用Providerの共通インターフェース
export interface GitCommandProvider {
  openTab(context: ExtensionContext): void;
}

// コマンド名とProviderクラスのマッピング設定
export const GIT_COMMAND_PROVIDERS: Record<string, () => Promise<GitCommandProvider>> = {
  "git pull": async () => {
    const module = await import("../providers/GitPullViewProvider");
    return new module.GitPullViewProvider({} as any); // contextは実際のopenTabで渡される
  },
  // 他のコマンドも今後追加
  // "git push": async () => {
  //   const module = await import("../providers/GitPushViewProvider");
  //   return new module.GitPushViewProvider({} as any);
  // },
};
