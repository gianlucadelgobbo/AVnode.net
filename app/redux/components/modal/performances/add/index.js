import React, { Component } from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Form from '../../../performances/add'

class AddPerformanceModal extends Component {

    render() {

        return (
            <Form history={this.props.history}/>
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
