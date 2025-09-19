import { ExtensionContext, WebviewView } from "vscode";
import { GIT_COMMANDS } from "../const/gitCommands";
import { GitPullViewProvider } from "../providers/GitPullViewProvider";

export class GitEventListener {
  constructor(private readonly _context: ExtensionContext) {}

  public setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openGitCommandTab":
          // コマンドごとにProviderを呼び出す
          if (message.commandName === GIT_COMMANDS.PULL.command) {
            new GitPullViewProvider(this._context).openTab(this._context);
          }
          // 他コマンドも今後追加
          break;

        default:
          break;
      }
    });
  }
}
