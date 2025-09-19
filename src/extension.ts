import { ExtensionContext, window } from "vscode";
import { ViewProvider } from "./app/sidebar/ViewProvider";
import { GitPullViewProvider } from "./app/git-pull/GitPullViewProvider";

export function activate(context: ExtensionContext) {
  const providers = [
    { viewType: ViewProvider.viewType, provider: new ViewProvider(context) },
    { viewType: GitPullViewProvider.viewType, provider: new GitPullViewProvider(context) },
  ];

  providers.forEach(({ viewType, provider }) => {
    const disposable = window.registerWebviewViewProvider(viewType, provider);
    context.subscriptions.push(disposable);
  });
}
