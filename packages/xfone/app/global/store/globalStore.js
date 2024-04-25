import { createStore } from 'redux';
import { globalReducer } from '../reducer/globalReducer';

export const globalXfoneStore = createStore(globalReducer);
