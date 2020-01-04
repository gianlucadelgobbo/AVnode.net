import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { showModal } from "../../modal/actions";
import {getModel, getModelIsFetching, getModelErrorMessage} from "../selectors";
import { fetchModel, saveModel } from "./actions";
import ImageForm from "../../image";
import { FormattedMessage } from "react-intl";
import properties from "../../../../../config/default.json";
import TitleComponent from "../../titleComponent";
import { NEWS_NAME, SHOW } from "./constants";

class NewsImage extends Component {
  render() {
    const {
      model = {},
      isFetching,
      match: {
        params: { _id }
      },
      errorMessage,
      fetchModel,
      saveModel
    } = this.props;
    const { components } = properties.cpanel.news.forms.image;
    console.log(model);
    return (
      <div>
        <TitleComponent title={model.title} link={"/news/"+model.slug} show={SHOW} />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{NEWS_NAME}</h3>

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
    );
  }
}

const mapStateToProps = (state, {
  match: {
    params: { _id }
  }
}) => ({
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

NewsImage = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsImage);

export default NewsImage;
