import { extensions, Uri, WebviewPanel, window, workspace } from "vscode";
import { EventTypes } from "../../types/classNames";

export class GitAddViewEventListener {
  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case EventTypes.sendAlert:
          try {
            let file: string = "";
            message.files.map((f: string) => {
              file += `"${f}" `;
            });

            const terminal = window.createTerminal('git add');
            terminal.show();
            terminal.sendText((`git add ${file}`).trim());

            window.showInformationMessage('Git Addを実行しました');
            webviewView.webview.postMessage({
              type: EventTypes.fileAdded
            });
          } catch (err: any) {
            window.showErrorMessage(`実行に失敗しました: ${err.message}`);
          }
          break;

        case EventTypes.openGitAddDialog:
          await this._getChangedFiles(webviewView);
          break;

        default:
          break;
      }
    });
  }

  private async getGitRepository() {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }

    const gitExtension = extensions.getExtension("vscode.git");
    if (!gitExtension) {
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

  private async _getChangedFiles(webviewView: WebviewPanel) {
    try {
      const workspaceFolder = workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        webviewView.webview.postMessage({
          type: EventTypes.changedFilesResult,
          error: "ワークスペースフォルダが見つかりません",
        });
        return;
      }

      const workspacePath = workspaceFolder.uri.fsPath;
      let allChangedFiles: string[] = [];

      // VS CodeのGit APIを使用
      const repository = await this.getGitRepository();
      if (repository) {
        // 1. ワーキングツリーの変更されたファイル（Modified/Deleted/Added）
        const workingTreeChanges = repository.state.workingTreeChanges.map((change: any) => {
          const relativePath = change.uri.fsPath
            .replace(workspacePath, "")
            .replace(/^[\\\/]/, "")
            .replace(/\\/g, "/");
          return relativePath;
        });

        if (workingTreeChanges.length > 0) {
          allChangedFiles.push(...workingTreeChanges);
        }
      } else {
        webviewView.webview.postMessage({
          type: EventTypes.changedFilesResult,
          error: "Git APIが利用できません。Gitリポジトリではない可能性があります。",
        });
        return;
      }

      // 重複を削除
      const uniqueFiles = [...new Set(allChangedFiles)].filter((file) => file.trim() !== "");

      webviewView.webview.postMessage({
        type: EventTypes.changedFilesResult,
        files: uniqueFiles
      });

    } catch (error) {
      webviewView.webview.postMessage({
        type: EventTypes.changedFilesResult,
        error: `エラーが発生しました: ${error}`,
      });
    }
  }
}
