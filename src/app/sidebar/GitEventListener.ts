import { ExtensionContext, WebviewView } from "vscode";
import { GIT_COMMANDS } from "../../const/gitCommands";
import { GitPullViewProvider } from "../git-pull/GitPullViewProvider";
import { GitPushViewProvider } from "../git-push/GitPushViewProvider";
import { GitAddViewProvider } from "../git-add/GitAddViewProvider";
import { GitCommitViewProvider } from "../git-commit/GitCommitViewProvider";

export class GitEventListener {
  constructor(private readonly _context: ExtensionContext) { }

  public setWebviewMessageListener(webviewView: WebviewView) {
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openGitCommandTab":
          // コマンドごとにProviderを呼び出す
          if (message.commandName === GIT_COMMANDS.pull.command) {
            new GitPullViewProvider(this._context).openTab(this._context);
          }

          if (message.commandName === GIT_COMMANDS.push.command) {
            new GitPushViewProvider(this._context).openTab(this._context);
          }

          if (message.commandName === GIT_COMMANDS.add.command) {
            new GitAddViewProvider(this._context).openTab(this._context);
          }

          if (message.commandName === GIT_COMMANDS.commit.command) {
            new GitCommitViewProvider(this._context).openTab(this._context);
          }
          break;
        default:
          break;
      }
    });
  }
}
