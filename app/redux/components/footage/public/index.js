import React, { Component } from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import { saveModel, fetchModel, uploadModel } from "./actions";
import { saveFootageVideo } from "../../../api";
import { showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { MODAL_SAVED } from "../../modal/constants";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import { FOOTAGE_NAME, FOOTAGE_CODES_TAGS } from "./constants";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { populateMultiLanguageObject } from "../../common/form";

class FootagePublic extends Component {
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

    model.tags = values.tags;

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

    // Convert about format for FieldArray redux-form
    f.abouts = populateMultiLanguageObject("abouts", abouts);

    f.users = model.users || [];

    f.tags = model.tags || [];
    f.tags = [];
    if (Array.isArray(model.tags)) {
      // convert tags obj
      f.tags = model.tags.map(t => ({
        id: t.old_id,
        text: t.tag
      }));
    }

    return f;
  }

  getFormattedTags() {
    const { model } = this.props;
    if (!model) {
      return [];
    }
    let tags = [];
    if (Array.isArray(model.tags)) {
      tags = model.tags.map(t => ({
        id: t.old_id,
        text: t.tag
      }));
    }
    return tags;
  }
  handleDelete(i) {
    let tags = this.tags;
    tags.splice(i, 1);
    return tags;
  }
  handleTagClick(index) {
    console.log("The tag at index " + index + " was clicked");
  }
  handleAddition(tag) {
    let tags = this.tags;
    tags.push(tag);
    return tags;
  }

  uploadFile(files) {
    console.log("files");
    console.log(files);
    const { model, uploadModel } = this.props;
    model.video = files;
    return uploadModel(model).then(model => {
      if (model && model.id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }

  onSubmit(values) {
    const { showModal, saveModel, model } = this.props;
    const modelToSave = this.createModelToSave(values);

    modelToSave._id = model._id;

    //dispatch the action to save the model here
    return saveModel(modelToSave).then(model => {
      if (model && model.id) {
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
      errorMessage
    } = this.props;
    console.log(errorMessage);
    const delimiters = [FOOTAGE_CODES_TAGS.comma, FOOTAGE_CODES_TAGS.enter];

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
            <TitleComponent title={model.title} type={FOOTAGE_NAME} />
          )}

          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            model={model}
            showModal={showModal}
            tabs={locales}
            labels={locales_labels}
            tags={this.getFormattedTags()}
            delimiters={delimiters}
            handleDelete={this.handleDelete}
            handleTagClick={this.handleTagClick}
            handleAddition={this.handleAddition}
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
      uploadModel
    },
    dispatch
  );

FootagePublic = connect(
  mapStateToProps,
  mapDispatchToProps
)(FootagePublic);

export default FootagePublic;
