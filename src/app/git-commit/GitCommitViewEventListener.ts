import { EventTypes } from "@/types/classNames";
import { extensions, WebviewPanel, window, workspace } from "vscode";

export class GitCommitViewEventListener {
  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case EventTypes.openDialog:
          this._getChangedFiles(webviewView);
          break;

        case EventTypes.sendAlert:
          try {
            const terminal = window.createTerminal('git commit');
            terminal.show();
            terminal.sendText((`git commit -m "${message.commitMessage.trim()}"`));

            window.showInformationMessage('Git Commitを実行しました');
            webviewView.webview.postMessage({
              type: EventTypes.complete
            });
          } catch (err: any) {
            window.showErrorMessage(`実行に失敗しました: ${err.message}`);
          }
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

      // VS CodeのGit APIを使用
      const repository = await this.getGitRepository();
      if (repository) {
        // 1. ワーキングツリーの変更されたファイル（Modified/Deleted/Added）
        const indexChanges = repository.state.indexChanges.map((change: any) => {
          const relativePath = change.uri.fsPath
            .replace(workspacePath, "")
            .replace(/^[\\\/]/, "")
            .replace(/\\/g, "/");
          return relativePath;
        });

        if (indexChanges.length === 0) {
          webviewView.webview.postMessage({
            type: EventTypes.changedFilesResult,
            error: "変更されたファイルがありません。先にGit Addを実行してください。",
          });
        }

        return;
      } else {
        webviewView.webview.postMessage({
          type: EventTypes.changedFilesResult,
          error: "Git APIが利用できません。Gitリポジトリではない可能性があります。",
        });
        return;
      }
    } catch (error) {
      webviewView.webview.postMessage({
        type: EventTypes.changedFilesResult,
        error: `エラーが発生しました: ${error}`,
      });
    }
  }
}
