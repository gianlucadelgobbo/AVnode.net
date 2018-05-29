import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from '../../../crews/add';

class AddCrewModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddCrewModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddCrewModal);

export default AddCrewModal;
