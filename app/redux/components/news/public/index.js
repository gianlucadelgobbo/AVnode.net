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
import { NEWS_NAME, /* NEWS_CODES_TAGS,  */SHOW } from "./constants";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { populateMultiLanguageObject } from "../../common/form";
import { removeModel } from "../users/actions";
import { fetchNewsPublic } from "../../../api";

class NewsPublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /* tags: [], */
      suggestions: []
    };
    /* this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this); */
  }
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
    /* fetchNewsPublic({ id: _id }).then(result => {
      this.setState({
        tags:
          result.tags !== undefined || null
            ? result.tags.map(t => ({
                id: t.old_id || t._id,
                text: t.tag
              }))
            : []
      });
    }); */
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    /* const { tags } = this.state;

    model.tags = tags.map(m => ({ old_id: m.id, tag: m.text })); */

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
    //Convert title
    f.title = model.title;
    // Convert about format for FieldArray redux-form
    f.abouts = populateMultiLanguageObject("abouts", abouts);

    f.users = model.users || [];

    /* f.tags = model.tags || [];
    f.tags = [];
    if (Array.isArray(model.tags)) {
      // convert tags obj
      f.tags = model.tags.map(t => ({
        id: t.old_id,
        text: t.tag
      }));
    } */

    return f;
  }

  /* getFormattedTags() {
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
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  uploadFile(files) {
    const { model, uploadModel, showModal } = this.props;
    model.image = files;
    return uploadModel(model).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  } */

  onSubmit(values) {
    const { showModal, saveModel, model } = this.props;
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
      removeModel,
      match: {
        params: { _id }
      },
      isFetching,
      errorMessage
    } = this.props;
    /* const { tags } = this.state;
    const delimiters = [NEWS_CODES_TAGS.comma, NEWS_CODES_TAGS.enter]; */
    return (
      <div>
        {isFetching && !model && <Loading />}

        {errorMessage && (
          <ErrorMessage
            errorMessage={errorMessage[Object.keys(errorMessage)]}
          />
        )}

        {!errorMessage && !isFetching && !model && <ItemNotFound />}

        <TitleComponent title={model.title} link={"/news/"+model.slug} show={SHOW} />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{NEWS_NAME}</h3>

        <Form
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit.bind(this)}
          model={model}
          _id={_id}
          removeModel={removeModel}
          showModal={showModal}
          tabs={locales}
          labels={locales_labels}
          /* tags={tags || []}
          delimiters={delimiters} */
          /*  handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          uploadFile={this.uploadFile.bind(this)} */
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
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      fetchModel,
      removeModel,
      showModal,
      uploadModel
    },
    dispatch
  );

NewsPublic = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsPublic);

export default NewsPublic;
