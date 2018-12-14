import React, { Component } from 'react';
import {injectIntl} from "react-intl";
import Parser from 'html-react-parser';

class ErrorMessage extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

    render() {

        const {errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="alert alert-danger" role="alert">
                        Ops... {errorMessage}
                    </div>
                </div>
            </div>
        );
    }
}

ErrorMessage = injectIntl(ErrorMessage);

export default ErrorMessage;