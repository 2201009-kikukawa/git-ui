import { WebviewPanel, window } from "vscode";
import { EventTypes } from "../../types/classNames";

export class GitAddViewEventListener {
  public setWebviewMessageListener(webviewView: WebviewPanel) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case EventTypes.sendAlert:
          try {
            const terminal = window.createTerminal('git add');
            terminal.show();
            terminal.sendText(('git add .'));
            window.showInformationMessage('Git Addを実行しました');
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
