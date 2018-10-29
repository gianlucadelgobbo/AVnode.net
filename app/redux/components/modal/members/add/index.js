import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Form from "./form";

class AddMembersModal extends Component {
  render() {
    return <Form />;
  }
}

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddMembersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMembersModal);

export default AddMembersModal;
