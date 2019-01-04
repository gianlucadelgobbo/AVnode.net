import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Form from "../../../videos/add";

class AddVideosModal extends Component {
  render() {
    return <Form history={this.props.history} />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddVideosModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVideosModal);

export default AddVideosModal;
