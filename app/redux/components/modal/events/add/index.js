import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Form from "../../events/add";

class AddEventModal extends Component {
  render() {
    return <Form history={this.props.history} />;
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

AddEventModal = connect(mapStateToProps, mapDispatchToProps)(AddEventModal);

export default AddEventModal;
