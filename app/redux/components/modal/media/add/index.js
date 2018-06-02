import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from './form'

class AddMediaModal extends Component {

    render() {

        const {onSubmit, model} = this.props;

        return (
            <Form
                onSubmit={onSubmit}
                model={model}
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
