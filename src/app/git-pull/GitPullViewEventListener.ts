import { ExtensionContext, WebviewPanel, window } from "vscode";
import { GIT_COMMANDS } from "../../const/gitCommands";
import { EventTypes } from "../../types/classNames";
import { GitCommitViewProvider } from "../git-commit/GitCommitViewProvider";

export class GitPullViewEventListener {
  constructor(private readonly _context: ExtensionContext) {}

  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case EventTypes.sendAlert:
          if (message.file) {
            switch (message.file) {
              case "commit":
                new GitCommitViewProvider(this._context).openTab(this._context);
            }
          } else {
            try {
              const terminal = window.createTerminal("git pull");
              terminal.show();
              terminal.sendText(GIT_COMMANDS.pull.command);
              window.showInformationMessage(
                "Git Pullを実行しました。最新の変更がファイルに適用されているか確認してみましょう。"
              );
            } catch (err: any) {
              window.showErrorMessage(`実行に失敗しました: ${err.message}`);
            }
          }
          break;

        default:
          break;
      }
    });
  }
}
