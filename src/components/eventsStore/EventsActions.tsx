import { ActionType, ListenAction, UnlistenAction, EmitAction } from './EventTypes';

export const listen = (eventName: string, callback: (data: any) => void): ListenAction => ({
    type: ActionType.LISTEN,
    payload: { eventName, callback }
});

export const unlisten = (eventName: string, callback: (data: any) => void): UnlistenAction => ({
    type: ActionType.UNLISTEN,
    payload: { eventName, callback }
});

export const emit = (eventName: string, data: any): EmitAction => ({
    type: ActionType.EMIT,
    payload: { eventName, data }
});
