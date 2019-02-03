import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { fetchModel, saveModel } from "./actions";
import ImageForm from "../../image";
import { withRouter } from "react-router";
import { FormattedMessage } from "react-intl";
import properties from "../../../../../config/default.json";
import { EVENT_NAME, SHOW } from "./constants";
import TitleComponent from "../../titleComponent";

class EventImages extends Component {
  render() {
    const {
      model =  {},
      isFetching,
      errorMessage,
      match: {
        params: { _id }
      },
      fetchModel,
      saveModel
    } = this.props;

    const { components } = properties.cpanel.events.forms.image;

    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          <TitleComponent title={model.title} type={EVENT_NAME}  link={"/events/"+model.slug} show={SHOW}/>
          <ImageForm
            model={model}
            isFetching={isFetching}
            errorMessage={errorMessage}
            fetchModel={fetchModel}
            saveModel={saveModel}
            id={_id}
            properties={components}
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
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      saveModel
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EventImages)
);
