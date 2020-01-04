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
import { PERFORMANCE_NAME, SHOW } from "./constants";
import { removeModel } from "../users/actions";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default";
import { fetchList as fetchPerformancesCategories } from "../../categories/actions";
import { getList as getCategories } from "../../categories/selectors";
import {
  populateMultiLanguageObject,
  createMultiLanguageInitialObject
} from "../../common/form";
import { fetchPerformancePublic } from "../../../api";

class PerformancePublic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: "",
      selectedTechnique: "",
      selectedGenre: ""
    };
  }

  componentDidMount() {
    const {
      fetchModel,
      match: {
        params: { _id }
      },
      fetchPerformancesCategories
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchPerformancesCategories();
    fetchPerformancePublic({ id: _id }).then(result => {
      this.setState({
        selectedType: result.type !== undefined || null ? result.type._id : "",
        selectedTechnique:
          result.tecnique !== undefined || "" ? result.tecnique._id : "",
        selectedGenre: result.genre !== undefined || "" ? result.genre._id : ""
      });
    });
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values) || {};

    const { selectedType, selectedTechnique, selectedGenre } = this.state;

    model.type = selectedType;

    model.tecnique = selectedTechnique;

    model.genre = selectedGenre;

    model.is_public = model.is_public;

    model.categories = this.state.value;

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
    //model.tech_reqs = model.tech_reqs.filter(w => w.value);
    if (Array.isArray(model.tech_reqs)) {
      model.tech_reqs = model.tech_reqs.map(x => {
        const splitted = x.key.split(".");
        return {
          lang: splitted[splitted.length - 1],
          abouttext: x.value
        };
      });
    }
    if (Array.isArray(model.tech_arts)) {
      model.tech_arts = model.tech_arts.map(x => {
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

    const { abouts, tech_reqs, tech_arts } = model;
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
    v.tech_arts = populateMultiLanguageObject("tech_arts", tech_arts);
    v.tech_reqs = populateMultiLanguageObject("tech_reqs", tech_reqs);

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

  handleChange(key, value) {
    this.setState({ [key]: value });
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
      categories,
      removeModel
    } = this.props;

    const { selectedType, selectedTechnique, selectedGenre } = this.state;

    const getTechnique = () => {
      const view = categories.filter(item => item.key === selectedType);
      return view.length === 0 ? (
        ""
      ) : (
        <div>
          <div className="labelField">
            {view[0].children.length > 0 && `${view[0].title + " Technique"}`}
          </div>
          {view[0].children.length > 0 &&
            view[0].children.map(t => (
              <div className="form-check" key={t.key}>
                <input
                  className="form-check-input"
                  type="radio"
                  onChange={e =>
                    this.handleChange("selectedTechnique", e.target.id)
                  }
                  name="categoryRadios2"
                  id={t.key}
                  value={t.value}
                  checked={t.key === selectedTechnique}
                />
                <label className="form-check-label" htmlFor={t.value}>
                  {t.title}
                </label>
              </div>
            ))}
        </div>
      );
    };

    const getGenre = () => {
      const view = categories.filter(item => item.key === selectedType);
      const genres = view.length > 0 ? view[0].children : "";
      return genres.length === 0 ? (
        ""
      ) : (
        <div>
          <div className="labelField">
            {genres[0].children.length > 0 && `Genre`}
          </div>
          {genres[0].children.length > 0 &&
            genres[0].children.map(t => (
              <div className="form-check" key={t.key}>
                <input
                  className="form-check-input"
                  type="radio"
                  onChange={e =>
                    this.handleChange("selectedGenre", e.target.id)
                  }
                  name="categoryRadios3"
                  id={t.key}
                  value={t.value}
                  checked={t.key === selectedGenre}
                />
                <label className="form-check-label" htmlFor={t.value}>
                  {t.title}
                </label>
              </div>
            ))}
        </div>
      );
    };
    return (
      <div>
        {isFetching && !model && <Loading />}

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        {!errorMessage && !isFetching && !model && <ItemNotFound />}

        <TitleComponent title={model.title} link={"/performances/"+model.slug} show={SHOW} />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PERFORMANCE_NAME}</h3>

        <Form
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit.bind(this)}
          model={model}
          showModal={showModal}
          tabs={locales}
          labels={locales_labels}
          categories={categories}
          _id={_id}
          getTechnique={getTechnique()}
          handleChange={e => this.handleChange("selectedType", e.target.id)}
          getGenre={getGenre()}
          selectedType={selectedType}
          removeModel={removeModel}
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
  errorMessage: getModelErrorMessage(state, _id),
  categories: getCategories(state)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      fetchModel,
      showModal,
      removeModel,
      fetchPerformancesCategories
    },
    dispatch
  );

PerformancePublic = connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformancePublic);

export default PerformancePublic;
