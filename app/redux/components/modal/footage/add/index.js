import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from '../../../footage/add';

class AddFootageModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddFootageModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddFootageModal);

export default AddFootageModal;
