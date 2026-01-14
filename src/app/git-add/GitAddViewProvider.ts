import {
  CancellationToken,
  ExtensionContext,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
  window,
} from "vscode";
import { GitAddViewEventListener } from "./GitAddViewEventListener";
import { getUri } from "../../utilities/getUri";
import { getNonce } from "../../utilities/getNonce";

export class GitAddViewProvider implements WebviewViewProvider {
  public static readonly viewType = "git-add-view";
  private static activePanel: WebviewPanel | undefined;

  constructor(private readonly _context: ExtensionContext) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
    _token: CancellationToken
  ): Thenable<void> | void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(this._context.extensionUri, "out")],
    };

    webviewView.webview.html = this._getWebviewContent(
      webviewView.webview,
      this._context.extensionUri
    );
  }

  public openTab(context: ExtensionContext) {
    const panel = window.createWebviewPanel("git-add-tab", "Git Add", ViewColumn.Active, {
      enableScripts: true,
      localResourceRoots: [Uri.joinPath(context.extensionUri, "out")],
      retainContextWhenHidden: true,
    });
    GitAddViewProvider.activePanel = panel;
    const provider = new GitAddViewProvider(context);
    panel.webview.html = provider._getWebviewContent(panel.webview, context.extensionUri);
    const listener = new GitAddViewEventListener();
    listener.setWebviewMessageListener(panel);
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const viewUri = getUri(webview, extensionUri, ["out", "webview", "git-add", "GitAddView.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const iconUri = getUri(webview, extensionUri, ["out", "codicon.css"]);
    const imageUri = getUri(webview, extensionUri, ["out", "resources", "git-add-vs-code-ui.png"]);
    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; font-src ${webview.cspSource}; img-src ${webview.cspSource};">
          <link rel="stylesheet" href="${stylesUri}" />
          <link rel="stylesheet" href="${iconUri}">
          <title>Git Add</title>
        </head>
        <body>
          <div id="root" data-image-uri="${imageUri}"></div>
          <script type="module" nonce="${nonce}" src="${viewUri}"></script>
        </body>
      </html>
    `;
  }
}
