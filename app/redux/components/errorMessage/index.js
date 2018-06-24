import React, { Component } from 'react';

class ErrorMessage extends Component {

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

export default ErrorMessage;