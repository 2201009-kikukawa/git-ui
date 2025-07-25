import { ExtensionContext, WebviewView, workspace, extensions } from "vscode";

export class GitEventListener {
  constructor(private readonly _context: ExtensionContext) {}

  public setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "getChangedFiles":
          await this._getChangedFiles(webviewView, message.respectGitignore);
          break;
      }
    });
  }

  // VS CodeのGit拡張機能APIを使用してGitリポジトリ情報を取得
  private async getGitRepository() {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }

    const gitExtension = extensions.getExtension("vscode.git");
    if (!gitExtension) {
      console.log("[GitEventListener] Git拡張機能が見つかりません");
      return null;
    }

    if (!gitExtension.isActive) {
      await gitExtension.activate();
    }

    const git = gitExtension.exports.getAPI(1);
    const repository = git.repositories.find(
      (repo: any) => repo.rootUri.fsPath === workspaceFolder.uri.fsPath
    );

    return repository;
  }

  private async _getChangedFiles(webviewView: WebviewView, respectGitignore: boolean) {
    try {
      console.log(`[GitEventListener] ファイル取得開始 - gitignore考慮: ${respectGitignore}`);

      const workspaceFolder = workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        console.log("[GitEventListener] エラー: ワークスペースフォルダが見つかりません");
        webviewView.webview.postMessage({
          command: "changedFilesResult",
          error: "ワークスペースフォルダが見つかりません",
        });
        return;
      }

      const workspacePath = workspaceFolder.uri.fsPath;
      console.log(`[GitEventListener] 作業ディレクトリ: ${workspacePath}`);

      let allChangedFiles: string[] = [];

      // VS CodeのGit APIを使用
      const repository = await this.getGitRepository();
      if (repository) {
        console.log("[GitEventListener] VS Code Git APIを使用してファイル状態を取得");

        // 1. ワーキングツリーの変更されたファイル（Modified/Deleted/Added）
        const workingTreeChanges = repository.state.workingTreeChanges.map((change: any) => {
          const relativePath = change.uri.fsPath
            .replace(workspacePath, "")
            .replace(/^[\\\/]/, "")
            .replace(/\\/g, "/");

          // ステータス情報も含めてログ出力
          console.log(
            `[GitEventListener] ワーキングツリー変更: ${relativePath} (status: ${change.status})`
          );
          return relativePath;
        });

        console.log(
          `[GitEventListener] ワーキングツリーの変更ファイル: ${workingTreeChanges.length}個`
        );
        if (workingTreeChanges.length > 0) {
          allChangedFiles.push(...workingTreeChanges);
          console.log(`[GitEventListener] ワーキングツリー変更ファイル:`, workingTreeChanges);
        }

        // 2. インデックス（ステージング）の変更されたファイル
        const indexChanges = repository.state.indexChanges.map((change: any) => {
          const relativePath = change.uri.fsPath
            .replace(workspacePath, "")
            .replace(/^[\\\/]/, "")
            .replace(/\\/g, "/");

          console.log(
            `[GitEventListener] インデックス変更: ${relativePath} (status: ${change.status})`
          );
          return relativePath;
        });

        console.log(`[GitEventListener] インデックスの変更ファイル: ${indexChanges.length}個`);
        if (indexChanges.length > 0) {
          allChangedFiles.push(...indexChanges);
          console.log(`[GitEventListener] インデックス変更ファイル:`, indexChanges);
        }

        // 3. Untrackedファイル（respectGitignoreがfalseの場合のみ含める）
        if (!respectGitignore) {
          const untrackedChanges = repository.state.untrackedChanges.map((change: any) => {
            const relativePath = change.uri.fsPath
              .replace(workspacePath, "")
              .replace(/^[\\\/]/, "")
              .replace(/\\/g, "/");

            console.log(`[GitEventListener] 未追跡ファイル: ${relativePath}`);
            return relativePath;
          });

          console.log(`[GitEventListener] 未追跡ファイル: ${untrackedChanges.length}個`);
          if (untrackedChanges.length > 0) {
            allChangedFiles.push(...untrackedChanges);
            console.log(`[GitEventListener] 未追跡ファイル:`, untrackedChanges);
          }
        }

        // Gitリポジトリの状態情報をログ出力
        console.log(`[GitEventListener] リポジトリ状態:`, {
          workingTreeChanges: repository.state.workingTreeChanges.length,
          indexChanges: repository.state.indexChanges.length,
          untrackedChanges: repository.state.untrackedChanges?.length || 0,
          mergeChanges: repository.state.mergeChanges?.length || 0,
        });
      } else {
        console.log("[GitEventListener] Git APIが利用できません");
        webviewView.webview.postMessage({
          command: "changedFilesResult",
          error: "Git APIが利用できません。Gitリポジトリではない可能性があります。",
        });
        return;
      }

      console.log(`[GitEventListener] 全ファイル(重複含む): ${allChangedFiles.length}個`);
      console.log(`[GitEventListener] 全ファイルリスト:`, allChangedFiles);

      // 重複を削除
      const uniqueFiles = [...new Set(allChangedFiles)].filter((file) => file.trim() !== "");
      console.log(`[GitEventListener] 重複削除後: ${uniqueFiles.length}個`);
      console.log(`[GitEventListener] 最終ファイルリスト:`, uniqueFiles);

      webviewView.webview.postMessage({
        command: "changedFilesResult",
        files: uniqueFiles,
        respectGitignore: respectGitignore,
      });

      console.log("[GitEventListener] Webviewに結果を送信完了");
    } catch (error) {
      console.log("[GitEventListener] 予期しないエラー:", error);
      webviewView.webview.postMessage({
        command: "changedFilesResult",
        error: `エラーが発生しました: ${error}`,
      });
    }
  }
}
