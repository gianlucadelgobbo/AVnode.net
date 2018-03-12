import { Provider } from 'preact-redux';
import { h, render } from 'preact';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Language from './components/LanguageContainer';

import reducer from './reducers';
//import { fetchUser } from './reducers/actions';

//import createLogger from 'redux-logger';
//const loggerMiddleware = createLogger();
//loggerMiddleware

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
    )
  )
);

let root;

const init = () => {
  const App = require('./components/App').default;
  root = render(
    <Provider store={store}>
      <Language>
        <App />
      </Language>
    </Provider>
    ,
    document.getElementById('app'),
    root
  );
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    return requestAnimationFrame(init);
  });
}

init();
//store.dispatch(fetchUser());
