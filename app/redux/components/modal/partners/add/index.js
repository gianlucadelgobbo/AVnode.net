import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from './form'

class AddPartnerModal extends Component {

    render() {

        return (
            <Form/>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddPartnerModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPartnerModal);

export default AddPartnerModal;
