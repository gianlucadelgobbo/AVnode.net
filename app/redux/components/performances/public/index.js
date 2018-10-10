import React, { Component } from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import { saveModel, fetchModel } from "./actions";
import { showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { MODAL_SAVED } from "../../modal/constants";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import { PERFORMANCE_NAME } from "./constants";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { fetchList as fetchCategories } from "../../categories/actions";
import { getList as getCategories } from "../../categories/selectors";
import {
  populateMultiLanguageObject,
  createMultiLanguageInitialObject
} from "../../common/form";

class PerformancePublic extends Component {
  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      },
      fetchCategories
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchCategories();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    model.is_public = model.is_public;

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
    // Convert tech_reqs for API
    model.tech_reqs = model.tech_reqs.filter(w => w.value);

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;
    if (!model) {
      return {};
    }
    const { abouts } = model;
    let v = {};

    //Convert slug for redux-form
    v.slug = model.slug;

    //Convert title for redux-form
    v.title = model.title;

    v.abouts = populateMultiLanguageObject("abouts", abouts);

    v.is_public = model.is_public;
    v.categories = model.categories;
    v.users = model.users || [];
    v.price = model.price;
    v.duration = model.duration;
    v.tech_arts = createMultiLanguageInitialObject("tech_arts");
    v.tech_reqs = createMultiLanguageInitialObject("tech_reqs");
    // Convert tech_arts format for FieldArray redux-form
    /*v.tech_arts = [];
        if (Array.isArray(model.tech_arts)) {

            // convert current lang
            v.tech_arts = model.tech_arts.map(x => ({
                key: `tech_arts.${x.lang}`,
                value: x.text
            }));
        }

        locales.forEach(l => {
            let found = v.tech_arts.filter(o => o.key === `tech_arts.${l}`).length > 0;
            if (!found) {
                v.tech_arts.push({
                    key: `tech_arts.${l}`,
                    value: ""
                })
            }
        });
        v.tech_reqs = [];
        if (Array.isArray(model.tech_reqs)) {

            // convert current lang
            v.tech_reqs = model.tech_reqs.map(x => ({
                key: `tech_reqs.it`,
                value: x
            }));
        }

        locales.forEach(l => {
            let found = v.tech_reqs.filter(o => o.key === `tech_reqs.${l}`).length > 0;
            if (!found) {
                v.tech_reqs.push({
                    key: `tech_reqs.${l}`,
                    value: ""
                })
            }
        });
        */
    return v;
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
      errorMessage,
      categories
    } = this.props;

    console.log(12);
    return (
      <div className="row">
        <div className="col-md-2">
          <LateralMenu _id={_id} />
        </div>
        <div className="col-md-10">
          {isFetching && !model && <Loading />}

          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          {!errorMessage && !isFetching && !model && <ItemNotFound />}

          {!errorMessage &&
            !isFetching &&
            model && (
              <TitleComponent title={model.title} type={PERFORMANCE_NAME} />
            )}

          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            model={model}
            showModal={showModal}
            tabs={locales}
            labels={locales_labels}
            categories={categories}
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
  errorMessage: getModelErrorMessage(state, _id),
  categories: getCategories(state).map(c => ({ value: c._id, label: c.name }))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      fetchModel,
      showModal,
      fetchCategories
    },
    dispatch
  );

PerformancePublic = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformancePublic);

export default PerformancePublic;
