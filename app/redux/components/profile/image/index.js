import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { showModal } from "../../modal/actions";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { fetchModel, saveModel } from "./actions";
import ImageForm from "../../image";
import { FormattedMessage } from "react-intl";
import properties from "../../../../../config/default.json";

import TitleComponent from "../../titleComponent";
import { PROFILE_NAME, SHOW } from "./constants";

class ProfileImage extends Component {
  render() {
    const {
      model = {},
      isFetching,
      errorMessage,
      fetchModel,
      saveModel,
      match: {
        params: { _id }
      }
    } = this.props;

    const { components } = properties.cpanel.profile.forms.image;

    return (
      <div>
        <TitleComponent
          title={model.stagename}
          link={"/" + model.slug}
          show={SHOW}
        />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PROFILE_NAME}</h3>

        <ImageForm
          model={model}
          isFetching={isFetching}
          errorMessage={errorMessage}
          fetchModel={fetchModel}
          saveModel={saveModel}
          properties={components}
          multiple={false}
          id={_id}
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

ProfileImage = connect(mapStateToProps, mapDispatchToProps)(ProfileImage);

export default ProfileImage;
