import {h, Component} from 'preact';

class ErrorMessage extends Component {

    render() {

        const {errorMessage} = this.props;

        return (
            <div className="row">
                <div className="col-md-12">
                    Ops... {errorMessage}
                </div>
            </div>
        );
    }
}

export default ErrorMessage;