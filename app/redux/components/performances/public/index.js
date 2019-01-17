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
  constructor(props) {
    super(props)
    this.state = {
      selectedView: '',
      categorySelected:[]     
    }
  }

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

    model.categories =  this.state.value;

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
    return saveModel(modelToSave).then(response => {
      if (response.model && response.model._id) {
        showModal({
          type: MODAL_SAVED
        });
      }
    });
  }
  onChangeSelect(e){
    const {categories} = this.props;
    const categorySelected = categories.filter(item=>item.value===e.target.value);
    this.setState({selectedView: e.target.value, categorySelected:categorySelected});
  }

  onChangeRadios(e){
    console.log(e.target.value)
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

    const { selectedView, categorySelected } = this.state;

    console.log(selectedView)
   
    const getMajorMethod2 = () => {
      const view = categories.filter((item) => item.value === selectedView);
      return view.length === 0 ? (
        ""
      ) : (
        <div>
          {view[0].children.length>0 &&
          <select>
            {view[0].children.map((t) => <option key={t.key} value={t.value}>{t.title}</option>)}
          </select>
          }
        </div>
      );
    }

    const getMajorMethod = () => {
      const view = categories.filter((item) => item.value === selectedView);
      return view.length === 0 ? (
        ""
      ) : (
        <div>
          <div className="labelField">{view[0].children.length > 0 && `${view[0].title + " Technique"}`}</div>
          {view[0].children.length>0 &&
            view[0].children.map((t) => (
            <div className="form-check" key={t.key}>
              <input className="form-check-input" type="radio" onChange={(e)=>this.onChangeRadios(e)} name="categoryRadios2" id={t.key} value={t.value}/>
              <label className="form-check-label" htmlFor={t.value}>{t.title}</label>
            </div>
            ))} 
        </div>
      );
    }

    const getChildrenCategories2 = () => {
      const genres = categorySelected.length>0?categorySelected[0].children:"";
      console.log(genres);
      return genres.length === 0 ? (
        ""
        ) : (
        <div>
          {genres[0].children.length>0 &&
            <select>
              {genres[0].children.map((t) => <option key={t.key} value={t.value}>{t.title}</option>)}
            </select>
          }
        </div>
      );
    }
    const getChildrenCategories = () => {
      const genres = categorySelected.length>0?categorySelected[0].children:"";
      console.log(genres);
      return genres.length === 0 ? (
        ""
        ) : (
          <div>
          <div className="labelField">{genres[0].children.length > 0 && `Genre`}</div>
          {genres[0].children.length>0 &&
            genres[0].children.map((t) => (
            <div className="form-check" key={t.key}>
              <input className="form-check-input" type="radio" name="categoryRadios3" id={t.key} value={t.value}/>
              <label className="form-check-label" htmlFor={t.value}>{t.title}</label>
            </div>
            ))} 
        </div>
      );
    }
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
            _id={_id}
            getMajorMethod={getMajorMethod()}
            onChangeSelect={e => this.onChangeSelect(e)}
            getChildrenCategories={getChildrenCategories()}
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
  categories: getCategories(state)
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
