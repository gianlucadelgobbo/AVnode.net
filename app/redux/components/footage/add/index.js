import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { getModel, getModelErrorMessage } from "../selectors";
import { hideModal, showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { saveModel } from "../actions";
import ErrorMessage from "../../errorMessage";

class AddFootage extends Component {
  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    return v;
  }

  onSubmit(values) {
    const { history, saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(values);
    modelToSave.id = "2";
    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model.id) {
        history.push("/admin/footage/" + `${response.model.id}` + "/public");
        hideModal();
      }
    });
  }

  render() {
    const { showModal, errorMessage } = this.props;

    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            showModal={showModal}
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, _id) => ({
  model: getModel(state),
  errorMessage: getModelErrorMessage(state, (_id = "2"))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      hideModal,
      saveModel
    },
    dispatch
  );

AddFootage = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddFootage);

export default AddFootage;
