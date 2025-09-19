import { WebviewPanel, window } from "vscode";
import { GIT_COMMANDS } from "../const/gitCommands";
import { EventTypes } from "../types/classNames";

export class GitPullViewEventListener {

  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case EventTypes.sendAlert:
          try {
            const terminal = window.createTerminal('git pull');
            terminal.show();
            terminal.sendText(GIT_COMMANDS.PULL.command);
            window.showInformationMessage("Git Pullを実行しました");
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
