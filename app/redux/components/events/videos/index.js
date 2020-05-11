import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { getModel } from "../selectors";
import { fetchModel, saveModel, removeModel } from "./actions";
import {
  getModelIsFetching,
  getModelErrorMessage,
} from "../../events/selectors";
import { MODAL_ADD_EVENTS_VIDEOS } from "../../modal/constants";
import Video from "../../video";
import { FormattedMessage } from "react-intl";
import { EVENT_NAME, SHOW } from "./constants";
import TitleComponent from "../../titleComponent";

class EventsVideo extends Component {
  render() {
    const {
      model = {},
      isFetching,
      errorMessage,
      fetchModel,
      match: {
        params: { _id },
      },
      saveModel,
      removeModel,
      history,
    } = this.props;

    return (
      <div>
        <TitleComponent
          title={model.title}
          link={"/events/" + model.slug}
          show={SHOW}
        />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{EVENT_NAME}</h3>

        <Video
          model={model}
          modal={MODAL_ADD_EVENTS_VIDEOS}
          isFetching={isFetching}
          errorMessage={errorMessage}
          id={_id}
          fetchModel={fetchModel}
          saveModel={saveModel}
          history={history}
          removeModel={removeModel}
          type="EVENTS"
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
      params: { _id },
    },
  }
) => ({
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state),
  errorMessage: getModelErrorMessage(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchModel,
      saveModel,
      removeModel,
    },
    dispatch
  );

EventsVideo = connect(mapStateToProps, mapDispatchToProps)(EventsVideo);

export default EventsVideo;
