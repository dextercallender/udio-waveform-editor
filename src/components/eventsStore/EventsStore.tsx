// store.ts
import { createStore } from 'redux';
import { reducer } from './EventsReducer';

const store = createStore(reducer);

export default store;