import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {FormattedMessage, injectIntl} from 'react-intl';
import ModalRoot from '../../modal/root'

// // Sign Up Form
import SignUp from '../index';

class MainSignUp extends Component {
    render() {
        return (

        <div className="signup-container">
            
            <div className="main_title_bkg">
                <div className="container">
                    <h1>
                        <FormattedMessage
                            id="signup"
                            defaultMessage="CREATE ACCOUNT"
                        />
                    </h1>
                </div>
            </div>
            
            <Router>

                <div>
                  
                    <div className="container">
                        <Switch>
                           
                            <Route path="/signup" component={SignUp}/>

                        </Switch>

                    </div>
                </div>

            </Router>

            <ModalRoot/>

        </div>);
    }
}

export default injectIntl(MainSignUp);
