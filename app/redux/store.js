import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

import { loadingBarMiddleware } from 'react-redux-loading-bar'

//import createLogger from 'redux-logger';
//const loggerMiddleware = createLogger();
//loggerMiddleware

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducer,
    composeEnhancers(
        applyMiddleware(
            thunkMiddleware,
            loadingBarMiddleware(), // manages loading bar
        )
    )
);

export default store;