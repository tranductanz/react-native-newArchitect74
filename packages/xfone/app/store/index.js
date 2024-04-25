import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { rootReducer } from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();
export const store = createStore(
    rootReducer,
    //composeEnhancers(applyMiddleware(thunk))

    composeEnhancers(applyMiddleware(thunk, loggerMiddleware))
);
