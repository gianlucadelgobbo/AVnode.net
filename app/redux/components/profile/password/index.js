import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { showModal } from "../../modal/actions";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import {
  getDefaultModel,
  getDefaultModelErrorMessage,
  getDefaultModelIsFetching,
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { fetchModel, saveModel } from "./actions";
import { MODAL_SAVED } from "../../modal/constants";
import { getErrorMessage, getIsFetching } from "../../events/selectors";
import { FormattedMessage } from "react-intl";

import TitleComponent from "../../titleComponent";
import { PROFILE_NAME, SHOW } from "./constants";

/*
 * Responsabilita'
 * - Get form's initial values from redux state here
 * - pass initial values to form
 * - dispatch the action to save the model
 * */

class ProfilePassword extends Component {
  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      }
    } = this.props;
    fetchModel({ id: _id });
  }

  // Convert form values to API model
  createModelToSave(values) {
    let model = {};

    model.oldpassword = values.oldpassword;

    model.newpassword = values.password;

    model.newpasswordconfirm = values.confirmPassword;

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
    const { showModal, saveModel, model } = this.props;
    const modelToSave = this.createModelToSave(values);

    // Add auth user _id
    modelToSave._id = model._id;

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  render() {
    const {
      model = {},
      showModal,
      isFetching,
      errorMessage,
      match: {
        params: { _id }
      }
    } = this.props;

    return (
      <div>
        {isFetching && !model && <Loading />}

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        {!errorMessage && !isFetching && !model && <ItemNotFound />}

        <TitleComponent
          title={model.stagename}
          link={"/" + model.slug}
          show={SHOW}
        />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PROFILE_NAME}</h3>

        <Form
          initialValues={this.getInitialValues(this)}
          onSubmit={this.onSubmit.bind(this)}
          user={model}
          showModal={showModal}
        />
      </div>
    );
  }
}

const mapStateToProps = (
  state,
  {
    match: {
      params: { _id }
    }
  }
) => ({
  //model: getDefaultModel(state),
  //isFetching: getDefaultModelIsFetching(state),
  //errorMessage: getDefaultModelErrorMessage(state)
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      saveModel,
      showModal
    },
    dispatch
  );

ProfilePassword = connect(mapStateToProps, mapDispatchToProps)(ProfilePassword);

export default ProfilePassword;
