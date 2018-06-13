import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {FormattedMessage, injectIntl} from 'react-intl';
import {ACCOUNT_NAME} from '../../signup/constants';
import ModalRoot from '../../modal/root'

// // Sign Up Form
import SignUp from '../index';

class MainSignUp extends Component {
    render() {
        return (
        <div>
            
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">
                        <FormattedMessage
                            id="signup"
                            defaultMessage={ACCOUNT_NAME}
                        />
                    </h1>
                </div>
            </div>
            
            <Router>

                <div>
                  
                    <div className="container">
                        <Switch>
                           
                            <Route path="/admin/signup" component={SignUp}/>

                        </Switch>

                    </div>
                </div>

            </Router>

            <ModalRoot/>

        </div>);
    }
}

export default injectIntl(MainSignUp);
