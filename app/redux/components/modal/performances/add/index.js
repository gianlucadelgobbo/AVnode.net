import {h, Component} from 'preact';
import {bindActionCreators} from "redux";
import {connect} from "preact-redux";
import Form from '../../../performances/add'

class AddPerformanceModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddPerformanceModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPerformanceModal);

export default AddPerformanceModal;
