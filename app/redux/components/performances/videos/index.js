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
import Video from "../../video";
import { FormattedMessage } from "react-intl";
import TitleComponent from "../../titleComponent";
import { PERFORMANCE_NAME, SHOW } from "./constants";
import {
  MODAL_ADD_PERFORMANCES_VIDEOS
} from "../../modal/constants";

class PerformaceVideo extends Component {
  render() {
    const {
      model = {},
      isFetching,
      errorMessage,
      fetchModel,
      removeModel,
      saveModel,
      history,
      match: {
        params: { _id }
      }
    } = this.props;

    return (
      <div>
        <TitleComponent title={model.title} link={"/performances/"+model.slug} show={SHOW} />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PERFORMANCE_NAME}</h3>
        <Video
          model={model}
          modal={MODAL_ADD_PERFORMANCES_VIDEOS}
          isFetching={isFetching}
          errorMessage={errorMessage}
          id={_id}
          fetchModel={fetchModel}
          saveModel={saveModel}
          removeModel={removeModel}
          history={history}
        />
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
