import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { showModal, hideModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { fetchList, saveModel } from "../actions";
import ErrorMessage from "../../errorMessage";

class AddCrew extends Component {
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
    const { saveModel, history, hideModal } = this.props;
    const modelToSave = this.createModelToSave(values);

    //console.log(saveModel, saveModel.then);
    modelToSave.id = "1";

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model.id) {
        history.push(
          "/admin/crews/" + `${response.model.id}` + "/public/"
        );
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
  errorMessage: getModelErrorMessage(state, (_id = "1"))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showModal,
      hideModal,
      saveModel,
      fetchList
    },
    dispatch
  );

AddCrew = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCrew);

export default AddCrew;
