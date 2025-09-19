import { WebviewPanel, window } from "vscode";
import { GIT_COMMANDS } from "../../const/gitCommands";
import { EventTypes } from "../../types/classNames";

export class GitPushViewEventListener {

  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case EventTypes.sendAlert:
          try {
            const terminal = window.createTerminal('git push');
            terminal.show();
            terminal.sendText(GIT_COMMANDS.push.command);
            window.showInformationMessage("Git Pushを実行しました");
          } catch (err: any) {
            window.showErrorMessage(`実行に失敗しました: ${err.message}`);
          }
          break;

        default:
          break;
      }
    });
  }
}
