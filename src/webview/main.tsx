import ReactDOM from "react-dom/client";
import { GIT_COMMANDS } from "../const/gitCommands";
import { VSCODE_THEME_COLORS, CSS_VARIABLE_NAMES } from "../const/colors";
import React from "react";
import "./styles.css";

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
      {GIT_COMMANDS.map((command) => (
        <div key={command.key} className="git-command-item">
          <div className="git-command-name">{command.command}</div>
          <div className="git-command-description">{command.description}</div>
        </div>
      ))}

      <div className="icon-area-wrap">
        <span className="codicon codicon-github-inverted git-icon"></span>
        <div className="icon-description">
          <p>リモートリポジトリ</p>
          <p>(GitHub)</p>
        </div>

        <div className="animation-container">
          <div className="arrow"></div>
          <div className="arrow"></div>
          <div className="arrow"></div>
        </div>

        <span className="codicon codicon-vm vm-icon"></span>
        <div className="icon-description">
          <p className="icon-description">ローカルリポジトリ</p>
          <p>(PC)</p>
        </div>
      </div>
    </div>
  );
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));
