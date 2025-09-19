export enum EventTypes {
  sendAlert = "sendAlert",
};

export type EventListenerProps = {
  type: EventTypes;
};
