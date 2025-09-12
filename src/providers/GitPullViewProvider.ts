import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
  ExtensionContext,
  window,
  WebviewPanel,
  ViewColumn,
} from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";
import { GitCommandProvider } from "../config/GitCommandRegistry";

export class GitPullViewProvider implements WebviewViewProvider, GitCommandProvider {
  public static readonly viewType = "git-pull-view";
  private static activePanel: WebviewPanel | undefined;

  constructor(private readonly _context: ExtensionContext) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this._context.extensionUri, "out")],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this._context.extensionUri
    );
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const viewUri = getUri(webview, extensionUri, ["out", "webview", "git-pull", "GitPullView.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    console.log("GitPull Webview URIs:", { viewUri, stylesUri, nonce });

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href="${stylesUri}" />
          <title>Git Pull</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${viewUri}"></script>
        </body>
      </html>
    `;
  }

  // GitCommandProviderインターフェース実装
  public openTab(context: ExtensionContext) {
    GitPullViewProvider.openTabStatic(context);
  }

  // 新規タブとしてWebviewPanelを開く静的メソッド
  public static openTabStatic(context: ExtensionContext) {
    // 既存のパネルが存在し、表示可能な場合はそれをアクティブにする
    if (GitPullViewProvider.activePanel) {
      GitPullViewProvider.activePanel.reveal(ViewColumn.Active);
      return;
    }

    // 新しいパネルを作成
    const panel = window.createWebviewPanel(
      "git-pull-tab", // viewTypeを一意にする
      "Git Pull",
      ViewColumn.Active,
      {
        enableScripts: true,
        localResourceRoots: [Uri.joinPath(context.extensionUri, "out")],
        // Webviewを保持してタブが非表示になっても破棄されないようにする
        retainContextWhenHidden: true,
      }
    );

    GitPullViewProvider.activePanel = panel;

    // Git Pull専用のWebviewコンテンツを設定
    const provider = new GitPullViewProvider(context);
    panel.webview.html = provider._getWebviewContent(panel.webview, context.extensionUri);

    // パネルが破棄された時の処理
    panel.onDidDispose(() => {
      GitPullViewProvider.activePanel = undefined;
    });
  }
}
