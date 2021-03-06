import React, { Component } from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import { saveModel, fetchModel, uploadModel } from "./actions";
import { showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
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
import { fetchVideoList as fetchVideosCategories } from "../../categories/actions";
import { getList as getCategories } from "../../categories/selectors";
import { populateMultiLanguageObject } from "../../common/form";
import { VIDEO_NAME, SHOW } from "./constants";
import { removeModel } from "../users/actions";

class VideosPublic extends Component {
  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      },
      fetchVideosCategories
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchVideosCategories();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    model.is_public = model.is_public;

    if (model.categories) {
      model.categories = model.categories.value;
    }

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
    } else {

    const { abouts, categories } = model;

    let f = {};
    if (categories) {
      f.categories = categories.map(category => {
        return { label: category.name, value: category._id };
      });
    }
    console.log(model)
    console.log(model.is_public)
    console.log(model.media)

    //Convert slug for redux-form
    f.slug = model.slug;
    //Convert stagename
    f.title = model.title;
    //Convert stagename
    f.is_public = model.is_public;
    //Convert Video
    f.media = model.media;
    //f.iframe = model.media.iframe;
    // Convert about format for FieldArray redux-form
    f.abouts = populateMultiLanguageObject("abouts", abouts);

    f.users = model.users || [];

    return f;
    }
  }

  uploadFile(files) {
    const { model, uploadModel, showModal } = this.props;
    model.video = files;
    model.onUploadProgress = ProgressEvent => {
      console.log((ProgressEvent.loaded / ProgressEvent.total) * 100);
    };
    return uploadModel(model).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  onSubmit(values) {
    const { showModal, saveModel, model, removeModel } = this.props;
    const modelToSave = this.createModelToSave(values);

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
      match: {
        params: { _id }
      },
      isFetching,
      errorMessage,
      removeModel,
      categories
    } = this.props;
    return (
      <div>
        {isFetching && !model && <Loading />}

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        {!errorMessage && !isFetching && !model && <ItemNotFound />}

        {!errorMessage && !isFetching && model.title && 
      <div>
      <TitleComponent
          title={model.title}
          link={"/videos/" + model.slug}
          show={SHOW}
        />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{VIDEO_NAME}</h3>

        <Form
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit.bind(this)}
          media={model.media}
          showModal={showModal}
          tabs={locales}
          labels={locales_labels}
          uploadFile={this.uploadFile.bind(this)}
          _id={_id}
          categories={categories}
          removeModel={removeModel}
          model={model}
        />
        </div>}
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
  errorMessage: getModelErrorMessage(state, _id),
  categories: getCategories(state).map(c => ({ value: c._id, label: c.name }))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      fetchModel,
      removeModel,
      showModal,
      uploadModel,
      fetchVideosCategories
    },
    dispatch
  );

VideosPublic = connect(mapStateToProps, mapDispatchToProps)(VideosPublic);

export default VideosPublic;
