export enum ActionType {
    LISTEN = 'LISTEN',
    UNLISTEN = 'UNLISTEN',
    EMIT = 'EMIT'
}

export interface ListenAction {
    type: ActionType.LISTEN;
    payload: { eventName: string; callback: (data: any) => void };
}

export interface UnlistenAction {
    type: ActionType.UNLISTEN;
    payload: { eventName: string; callback: (data: any) => void };
}

export interface EmitAction {
    type: ActionType.EMIT;
    payload: { eventName: string; data: any };
}

export type Action = ListenAction | UnlistenAction | EmitAction;

export interface EventData {
    date: any;
    parameters: any;
    data: any;
    media: any;
}

export interface State {
    subscribers: { [eventName: string]: Array<(data: any) => void> };
    eventHistory: Array<{ eventName: string; data: EventData }>;
}