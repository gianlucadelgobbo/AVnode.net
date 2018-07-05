import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';

class ComingSoon extends Component {
    render() {
        return (<div>
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <h1 className="display-4">
                        <FormattedMessage
                            id="comingSoon"
                            defaultMessage="Coming soon!"
                        />
                    </h1>
                </div>
            </div>


        </div>);
    }
}

export default ComingSoon;
