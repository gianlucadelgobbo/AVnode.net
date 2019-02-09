import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import { showModal } from "../../modal/actions";
import Form from "./form";
import { saveModel, fetchModel, uploadModel } from "./actions";
import { MODAL_SAVED } from "../../modal/constants";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { populateMultiLanguageObject } from "../../common/form";
import { VIDEOS_NAME, SHOW } from "./constants";
// 1. LOADING BAR add actions generators
import {hideLoading, showLoading} from 'react-redux-loading-bar';

class VideosVideo extends Component {
  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      }
    } = this.props;
    fetchModel({
      id: _id
    });
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    //Convert abouts for API
    if (Array.isArray(model.abouts)) {
      model.abouts = model.abouts.map(x => {
        const splitted = x.key.split(".");
        return {
          lang: splitted[splitted.length - 1],
          abouttext: x.value
        };
      });
    }

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    const { abouts } = model;

    let f = {};

    //Convert slug for redux-form
    f.slug = model.slug;
    //Convert stagename
    f.title = model.title;
    //Convert Video
    f.media = model.media;
    // Convert about format for FieldArray redux-form
    f.abouts = populateMultiLanguageObject("abouts", abouts);

    f.users = model.users || [];

    return f;
  }

  uploadFile(files) {
    const { model, uploadModel, showModal } = this.props;
    model.video = files;
    return uploadModel(model).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  onSubmit(values) {
    const { showModal, saveModel, model, showLoading, hideLoading } = this.props;
    const modelToSave = this.createModelToSave(values);

    modelToSave._id = model._id;
    // 4. LOADING BAR show loading bar
    showLoading();

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
        // 5. LOADING BAR hide loading bar
        hideLoading();
      }
    });
  }

  render() {
    const {
      model = {},
      showModal,
      match: {
        params: { _id }
      },
      isFetching,
      errorMessage
    } = this.props;
    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          {isFetching && !model && <Loading />}

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          {!errorMessage && !isFetching && !model && <ItemNotFound />}

          {!errorMessage && !isFetching && model && (
            <TitleComponent title={model.title} type={VIDEOS_NAME} link={"/videos/"+model.slug} show={SHOW} />
          )}

          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            media={model.media}
            showModal={showModal}
            tabs={locales}
            labels={locales_labels}
            uploadFile={this.uploadFile.bind(this)}
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
      saveModel,
      fetchModel,
      showModal,
      uploadModel,
      // 2. LOADING BAR map actions to props
      showLoading,
      hideLoading
    },
    dispatch
  );

VideosVideo = connect(
  mapStateToProps,
  mapDispatchToProps
)(VideosVideo);

export default VideosVideo;
