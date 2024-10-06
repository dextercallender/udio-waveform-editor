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

export interface State {
    subscribers: { [eventName: string]: Array<(data: any) => void> };
}