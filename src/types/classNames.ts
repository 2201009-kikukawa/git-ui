export enum EventTypes {
  sendAlert = "sendAlert",
  choiceAddFiles = "choiceAddFiles",
  sendAddFiles = "sendAddFiles",
  openDialog = "openDialog",
  changedFilesResult = "changedFilesResult",
  complete = "complete"
};

export type EventListenerProps = {
  type: EventTypes;
  file?: string;
  files?: string[];
  commitMessage?: string;
};
