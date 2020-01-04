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
import Gallery from "../../gallery";
import { PERFORMANCE_NAME, SHOW } from "./constants";
import TitleComponent from "../../titleComponent";
import { FormattedMessage } from "react-intl";

class PerformanceGallery extends Component {
  getIntlString = (obj) => {
    const {intl} = this.props;
    return intl.formatMessage(obj)
  };
  render() {
    const {
      model = {},
      isFetching,
      errorMessage,
      match: {
        params: { _id }
      },
      saveModel,
      removeModel,
      fetchModel,
      history
    } = this.props;

    return (
      <div>
        <TitleComponent title={model.title} link={"/performances/"+model.slug} show={SHOW} />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PERFORMANCE_NAME}</h3>
        <Gallery
          model={model}
          isFetching={isFetching}
          errorMessage={errorMessage}
          removeModel={removeModel}
          saveModel={saveModel}
          id={_id}
          fetchModel={fetchModel}
          history={history}
          type="PERFORMANCES"
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

PerformanceGallery = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformanceGallery);

export default PerformanceGallery;
