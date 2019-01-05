import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Form from "../../../galleries/add";

class AddGalleriesModal extends Component {
  render() {
    return <Form history={this.props.history} />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddGalleriesModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddGalleriesModal);

export default AddGalleriesModal;
