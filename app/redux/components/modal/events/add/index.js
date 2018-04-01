import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import Form from '../../events/add'

class AddEventModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddEventModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEventModal);

export default AddEventModal;
