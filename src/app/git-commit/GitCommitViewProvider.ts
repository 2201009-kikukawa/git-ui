import { CancellationToken, ExtensionContext, Uri, ViewColumn, Webview, WebviewPanel, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window } from "vscode";
import { GitCommitViewEventListener } from "./GitCommitViewEventListener";
import { getUri } from "../../utilities/getUri";
import { getNonce } from "../../utilities/getNonce";

export class GitCommitViewProvider implements WebviewViewProvider {
  public static readonly viewType = 'git-commit-view';
  private static activePanel: WebviewPanel | undefined;

  constructor(private readonly _context: ExtensionContext) { }

  public resolveWebviewView(webviewView: WebviewView, context: WebviewViewResolveContext, _token: CancellationToken): Thenable<void> | void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this._context.extensionUri, 'out')],
    };

    webviewView.webview.html = this._getWebviewContent(webviewView.webview, this._context.extensionUri);
  }

  public openTab(context: ExtensionContext) {
    const panel = window.createWebviewPanel('git-commit-tab', 'Git Commit', ViewColumn.Active, {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(context.extensionUri, 'out')],
      retainContextWhenHidden: true,
    });
    GitCommitViewProvider.activePanel = panel;
    const provider = new GitCommitViewProvider(context);
    panel.webview.html = provider._getWebviewContent(panel.webview, context.extensionUri);
    const listener = new GitCommitViewEventListener();
    listener.setWebviewMessageListener(panel);
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const viewUri = getUri(webview, extensionUri, ['out', 'webview', 'git-commit', 'GitCommitView.js']);
    const stylesUri = getUri(webview, extensionUri, ['out', 'styles.css']);
    const iconUri = getUri(webview, extensionUri, ['out', 'codicon.css']);
    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource};">
          <link rel="stylesheet" href="${stylesUri}" />
          <link rel="stylesheet" href="${iconUri}">
          <title>Git Pull</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${viewUri}"></script>
        </body>
      </html>
    `;
  }
}
