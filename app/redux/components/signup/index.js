import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { showModal } from "../modal/actions";
import { bindActionCreators } from "redux";
import { MODAL_SAVED } from "../modal/constants";
import { OPTIONS } from "./constants";
import { saveModel } from "./actions";
import ErrorMessage from "../errorMessage";
import { getModelErrorMessage } from "./selectors";

class SignUp extends Component {
  componentDidMount() {
    //const {fetchModel} = this.props;
    //fetchModel();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    return model;
  }

  onSubmit(values) {
    const { showModal, saveModel, model } = this.props;
    const modelToSave = this.createModelToSave(values);
    // Add auth user _id
    modelToSave.id = "1";
    console.log(modelToSave);
    //dispatch the action to save the model here
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  handleChange() {
    console.log("isOpened");
  }

  render() {
    const { showModal, errorMessage } = this.props;
    const height = 50;
    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <Form
            onSubmit={this.onSubmit.bind(this)}
            showModal={showModal}
            options={OPTIONS}
            //onChange={this.handleChange.bind(this)}
            height={height}
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (
  state,
  {
    match: {
      params: { _id }
    }
  }
) => ({
  errorMessage: getModelErrorMessage(state, (_id = "1"))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      showModal
    },
    dispatch
  );

SignUp = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);

export default SignUp;
