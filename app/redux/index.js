import {Provider} from 'preact-redux';
import {h, render} from 'preact';
import Language from './components/languageContainer/index';
import App from './components/app/index';
import store from './store'

let root = document.getElementById('app');

const init = () => {

    render(
        <Provider store={store}>
            <Language>
                <App/>
            </Language>
        </Provider>,
        root
    );
};

init();