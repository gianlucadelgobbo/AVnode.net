import React, { Component } from "react";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { locales, locales_labels } from "../../../../../config/default.json";
import { fetchModel, saveModel } from "./actions";
import { showModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import TitleComponent from "../../titleComponent";
import { PROFILE_NAME, SHOW } from "./constants";
import { MODAL_SAVED } from "../../modal/constants";
import { sortByLanguage } from "../../common/form";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import axios from "axios";
// 1. LOADING BAR add actions generators
import { hideLoading, showLoading } from "react-redux-loading-bar";

/*
 * Responsabilita'
 * - Get form's initial values from redux state here
 * - pass initial values to form
 * - dispatch the action to save the model
 * */

class ProfilePublic extends Component {
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
    let model = Object.assign({}, values);

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

    // Convert web
    model.web = model.web.filter(w => w.url);

    // Convert social
    model.social = model.social.filter(w => w.url);


    // Convert addresses
    model.addresses = model.addresses.map(a => {
      /* const originalString = a.text;
      const split = originalString.split(",");
      const country = split[split.length - 1].trim();
      const locality = split[0].trim();
      const geometry = a.geometry; */
      //return { originalString, locality, country, geometry };
      return a.loc;
    });

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    //Convert stagename for redux-form
    v.stagename = model.stagename;

    //Convert slug for redux-form
    v.is_public = model.is_public;

    //Convert slug for redux-form
    v.slug = model.slug;

    // Convert about format for FieldArray redux-form
    v.abouts = [];
    if (Array.isArray(model.abouts)) {
      // convert current lang
      v.abouts = model.abouts.map(x => ({
        key: `abouts.${x.lang}`,
        value: x.abouttext,
        lang: x.lang
      }));
    }
    locales.forEach(l => {
      let found = v.abouts.filter(o => o.key === `abouts.${l}`).length > 0;
      if (!found) {
        v.abouts.push({
          key: `abouts.${l}`,
          value: "",
          lang: l
        });
      }
    });
    v.abouts = sortByLanguage(v.abouts);

    // Social: Add one item if value empty
    v.social =
      Array.isArray(model.social) && model.social.length > 0
        ? model.social
        : [{ url: "" }];

    // Web: Add one item if value empty
    v.web =
      Array.isArray(model.web) && model.web.length > 0
        ? model.web
        : [{ url: "" }];

    // Addresses: Add one item if value empty
    v.addresses =
      Array.isArray(model.addresses) && model.addresses.length > 0
        ? model.addresses.map(a => ({
            text: `${a.locality}, ${a.country}`
          }))
        : [{ text: "" }];

    return v;
  }

  createLatLongToSave = address => {
    return geocodeByAddress(address)
      .then(function(results) {
        return getLatLng(results[0]).then(geometry => [results, geometry]); // function(b) { return [resultA, b] }
      })
      .then(function([results, geometry]) {
        let loc = {};
        results[0].address_components.forEach(address_component => {
          if (address_component.types.indexOf("country") !== -1)
            loc.country = address_component.long_name;
          if (address_component.types.indexOf("locality") !== -1)
            loc.locality = address_component.long_name;
        });
        if (!loc.locality) {
          results[0].address_components.forEach(address_component => {
            if (
              address_component.types.indexOf("administrative_area_level_1") !==
              -1
            )
              loc.locality = address_component.long_name;
          });
        }
        loc.formatted_address = results[0].formatted_address;
        loc.geometry = geometry;
        return loc;
      });
  };

  onSubmit(values) {
    // 3. LOADING BAR get action from props
    const {
      showModal,
      saveModel,
      model,
      showLoading,
      hideLoading
    } = this.props;

    let promises = [];

    const addrs = values.addresses;
    addrs.forEach(a => {
      promises.push(
        this.createLatLongToSave(a.text)
          .then(result => {
            // add to a model
            a.loc = result;
          })
          .catch(() => {
            console.log("ciao da google!");
          })
      );
    });

    // 4. LOADING BAR show loading bar
    showLoading();

    return axios.all(promises).then(() => {
      //dispatch the action to save the model here
      const modelToSave = this.createModelToSave(values);

      modelToSave._id = model._id;
      //console.log("modelToSave");
      //console.log(modelToSave);

      return saveModel(modelToSave).then(response => {
        if (response.model && response.model._id) {
          showModal({
            type: MODAL_SAVED
          });
        }

        // 5. LOADING BAR hide loading bar
        hideLoading();
      });
    });
  }

  render() {
    const {
      model = {},
      showModal,
      isFetching,
      errorMessage,
      match: {
        params: { _id }
      }
    } = this.props;

    return (
      <div>
        {/*<h1 className="labelField">MY ACCOUNT PUBLIC DATA</h1>
                    <br/>*/}

        {isFetching && !model && <Loading />}

        {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

        {!errorMessage && !isFetching && !model && <ItemNotFound />}

        <TitleComponent
          title={model.stagename}
          link={"/" + model.slug}
          show={SHOW}
        />
        <LateralMenu _id={_id} />
        <hr />
        <h3 className="labelField mb-3">{PROFILE_NAME}</h3>

        <Form
          initialValues={this.getInitialValues()}
          onSubmit={this.onSubmit.bind(this)}
          tabs={locales}
          labels={locales_labels}
          showModal={showModal}
          model={model}
          //handleSelect={this.createLatLongToSave()}
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
      showModal,
      // 2. LOADING BAR map actions to props
      showLoading,
      hideLoading
    },
    dispatch
  );

ProfilePublic = connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);

export default ProfilePublic;
