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
import { GitEventListener } from "../listener/GitEventListener";
import { GIT_COMMAND_PROVIDERS } from "../config/GitCommandRegistry";

export class ViewProvider implements WebviewViewProvider {
  public static readonly viewType = "git-ui-view";

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

    const listener = new GitEventListener(this._context);
    listener.setWebviewMessageListener(webviewView);

    // Webviewからのメッセージを受信してWebviewPanelを開く
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.type === "openGitCommandTab") {
        this.openGitCommandTab(message.command);
      }
    });
  }

  private async openGitCommandTab(command: string) {
    const providerLoader = GIT_COMMAND_PROVIDERS[command];
    if (providerLoader) {
      try {
        const provider = await providerLoader();
        provider.openTab(this._context);
      } catch (error) {
        console.error(`Failed to load provider for command: ${command}`, error);
      }
    } else {
      console.warn(`No provider found for command: ${command}`);
    }
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["out", "webview", "main.js"]);
    const stylesUri = getUri(webview, extensionUri, ["out", "styles.css"]);
    const nonce = getNonce();

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" href="${stylesUri}" />
          <title>Git UI</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }
}
