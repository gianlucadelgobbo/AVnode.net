import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import Form from './form'

class AddMediaModal extends Component {

    render() {

        const {onSubmit} = this.props;

        return (
            <Form
                onSubmit={onSubmit}
            />
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddMediaModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddMediaModal);

export default AddMediaModal;
