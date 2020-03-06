import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { getModel, getModelErrorMessage } from "../../selectors";
import { showModal, hideModal } from "../../../modal/actions";
import { bindActionCreators } from "redux";
import { fetchModel, saveModel } from "../actions";
import ErrorMessage from "../../../errorMessage";
import { MODAL_SAVED } from "../../../modal/constants";

class AddPerformancesGalleries extends Component {
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
    const { history, saveModel, hideModal, id } = this.props;
    const modelToSave = this.createModelToSave(values);
    modelToSave._id = id;
    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        history.push("/admin/galleries/" + `${response.model._id}` + "/gallery");
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
      saveModel,
      fetchModel,
      hideModal
    },
    dispatch
  );

AddPerformancesGalleries = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPerformancesGalleries);

export default AddPerformancesGalleries;
