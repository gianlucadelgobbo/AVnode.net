import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { getModel } from "../selectors";
import { fetchModel, saveModel, removeModel } from "./actions";
import {
  getModelIsFetching,
  getModelErrorMessage
} from "../../events/selectors";
import Videos from "../../video";
import { FormattedMessage } from "react-intl";

class PerformaceVideo extends Component {
  render() {
    const {
      model,
      isFetching,
      errorMessage,
      fetchModel,
      removeModel,
      saveModel,
      match: {
        params: { _id }
      }
    } = this.props;

    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          <h2 className="labelField">
            <FormattedMessage
              id="PerformancePublicVideos"
              defaultMessage="PERFORMANCE VIDEOS"
            />
          </h2>

          <Videos
            model={model}
            isFetching={isFetching}
            errorMessage={errorMessage}
            id={_id}
            fetchModel={fetchModel}
            saveModel={saveModel}
            removeModel={removeModel}
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
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state),
  errorMessage: getModelErrorMessage(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      saveModel,
      removeModel
    },
    dispatch
  );

PerformaceVideo = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformaceVideo);

export default PerformaceVideo;
