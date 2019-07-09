import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {FormattedMessage, injectIntl} from 'react-intl';

import MainSignUp from '../signup/route/index';

import MainApp from '../main/index';

class App extends Component {

    render() {
        const location = window.location.pathname;
        return (
        <div>
            {location.indexOf("/signup")===0 ? (
                <MainSignUp/>
            ) : (
                <MainApp/>
            )}
        </div>
        );
    }
}

export default injectIntl(App);
