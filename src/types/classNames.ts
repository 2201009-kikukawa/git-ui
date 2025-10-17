export enum EventTypes {
  sendAlert = "sendAlert",
  choiceAddFiles = "choiceAddFiles",
  sendAddFiles = "sendAddFiles",
  openGitAddDialog = "openGitAddDialog",
  changedFilesResult = "changedFilesResult",
  fileAdded = "fileAdded"
};

export type EventListenerProps = {
  type: EventTypes;
  file?: string;
  files?: string[];
};
