// reducer.ts
import { ActionType, Action, State } from './EventTypes';

export const initialState: State = {
    subscribers: {},
    eventHistory: [],
};

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.LISTEN:
            return {
                ...state,
                subscribers: {
                    ...state.subscribers,
                    [action.payload.eventName]: [
                        ...(state.subscribers[action.payload.eventName] || []),
                        action.payload.callback
                    ]
                }
            };
        case ActionType.UNLISTEN:
            return {
                ...state,
                subscribers: {
                    ...state.subscribers,
                    [action.payload.eventName]: (state.subscribers[action.payload.eventName] || []).filter(
                        callback => callback !== action.payload.callback
                    )
                }
            };
        case ActionType.EMIT:
            state.eventHistory.push({ eventName: action.payload.eventName, data: action.payload.data });
            (state.subscribers[action.payload.eventName] || []).forEach(callback => callback(action.payload.data));
            return state;
        default:
            return state;
    }
};