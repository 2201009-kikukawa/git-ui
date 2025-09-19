import ReactDOM from "react-dom/client";
import { GIT_COMMANDS_ARRAY } from "../../const/gitCommands";
import { VSCODE_THEME_COLORS, CSS_VARIABLE_NAMES } from "../../const/colors";
import React from "react";

const vscode = acquireVsCodeApi();

// CSS変数を設定
const setCSSVariables = () => {
  const root = document.documentElement;
  root.style.setProperty(
    CSS_VARIABLE_NAMES.sidebarBackground,
    VSCODE_THEME_COLORS.sidebarBackground
  );
  root.style.setProperty(
    CSS_VARIABLE_NAMES.sideBarForeground,
    VSCODE_THEME_COLORS.sideBarForeground
  );
  root.style.setProperty(CSS_VARIABLE_NAMES.descriptionText, VSCODE_THEME_COLORS.descriptionText);
  root.style.setProperty(CSS_VARIABLE_NAMES.customBorder, VSCODE_THEME_COLORS.customBorder);
  root.style.setProperty(
    CSS_VARIABLE_NAMES.listHoverBackground,
    VSCODE_THEME_COLORS.listHoverBackground
  );
};

const main = () => {
  React.useEffect(() => {
    setCSSVariables();
  }, []);
  return (
    <div className="git-commands-container">
      {GIT_COMMANDS_ARRAY.map((command) => (
        <div
          key={command.key}
          className="git-command-item"
          onClick={() => handleCommandClick(command.command)}>
          <div className="git-command-name">{command.command}</div>
          <div className="git-command-description">{command.description}</div>
        </div>
      ))}
    </div>
  );
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));

// 共通のクリックハンドラ
const handleCommandClick = (command: string) => {
  vscode.postMessage({ command: "openGitCommandTab", commandName: command });
};
