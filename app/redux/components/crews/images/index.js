import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { showModal } from "../../modal/actions";
import { fetchModel, saveModel } from "./actions";
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import ImageForm from "../../image";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";

class CrewImage extends Component {
  render() {
    const {
      model,
      isFetching,
      match: {
        params: { _id }
      },
      errorMessage,
      fetchModel,
      saveModel
    } = this.props;
    console.log(model);
    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          <h2 className="labelField">
            <FormattedMessage id="CrewPublicImage" defaultMessage="MY IMAGE" />
          </h2>

          <br />

          <ImageForm
            model={model}
            isFetching={isFetching}
            errorMessage={errorMessage}
            fetchModel={fetchModel}
            saveModel={saveModel}
            id={_id}
          />
        </div>
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

CrewImage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CrewImage);

export default withRouter(CrewImage);
