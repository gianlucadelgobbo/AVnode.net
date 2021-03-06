import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { bindActionCreators } from "redux";
import LateralMenu from "../lateralMenu";
import Form from "./form";
import { connect } from "react-redux";
import { fetchModel, saveModel } from "./actions";
import { showModal } from "../../modal/actions";
import Loading from "../../loading";
import ErrorMessage from "../../errorMessage";
import ItemNotFound from "../../itemNotFound";
import { fetchList as fetchCountries } from "../../countries/actions";
import { getList as getCountries } from "../../countries/selectors";
import { MODAL_SAVED } from "../../modal/constants";
import {
  getModel,
  getModelIsFetching,
  getModelErrorMessage
} from "../selectors";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment from "moment";
import axios from "axios";
import { genders } from "../../../utils";
import { locales, locales_labels } from "../../../../../config/default.json";

import TitleComponent from "../../titleComponent";
import { PROFILE_NAME, SHOW } from "./constants";

/*
 * Responsabilita'
 * - Get form's initial values from redux state here
 * - pass initial values to form
 * - dispatch the action to save the model
 * */

class ProfilePrivate extends Component {
  componentDidMount() {
    const {
      fetchModel,
      fetchCountries,
      match: {
        params: { _id }
      }
    } = this.props;
    fetchModel({
      id: _id
    });
    fetchCountries();
  }
  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    //convert Gender
    model.gender = values.gender.value;
    //convert Lang
    model.lang = values.lang.value;
    //convert Birthday
    model.birthday = moment(values.birthday)
      .utc()
      .format();
    // Convert citizenship
    model.citizenship = model.citizenship;
    // Convert addresses_private
    model.addresses_private = model.addresses_private.map(a => {
      /* const originalString = a.text;
      const split = originalString.split(",");
      const country = split[split.length - 1].trim();
      const street = split[0].trim();
      const locality = split[split.length - 3].trim();
      const formatted_address = originalString;
      const geometry = a.geometry;
      return { formatted_address, street, locality, country, geometry }; */
      return a.loc;
    });
    // Convert Phone Number
    model.phone = model.phone
      .filter(a => a)
      .map(p => ({
        url: p.tel
      }));
    // Convert mobile Number
    model.mobile = model.mobile
      .filter(a => a)
      .map(p => ({
        url: p.tel
      }));
    // Convert skype
    model.skype = model.skype
      .filter(a => a)
      .map(p => ({
        url: p.text
      }));

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model, countries } = this.props;

    if (!model) {
      return {};
    }

    let v = {};
    //Convert name for redux-form
    v.name = model.name;
    //Convert surname for redux-form
    v.surname = model.surname;
    //Convert gender for redux-form
    v.gender = model.gender
      ? genders.filter(gender => gender.value === model.gender)
      : "";
    //Convert language preferred for redux-form
    v.lang = model.lang
      ? locales
          .map(l => ({
            value: l,
            label: locales_labels[l]
          }))
          .filter(lang => lang.value === model.lang)
      : "";
    //Convert birthday for redux-form
    v.birthday = new Date(model.birthday);
    //Convert citizenship for redux-form
    v.citizenship = model.citizenship;
    // Addresses_private: Add one item if value empty
    v.addresses_private =
      Array.isArray(model.addresses_private) &&
      model.addresses_private.length > 0
        ? model.addresses_private.map(a => ({
            text: `${a.locality}, ${a.country}`
          }))
        : [{ text: "" }];
    // Phone: Add one item if value empty
    v.phone =
      Array.isArray(model.phone) && model.phone.length > 0
        ? model.phone.filter(a => a).map(p => ({ tel: p.url }))
        : [""];
    // Mobile: Add one item if value empty
    v.mobile =
      Array.isArray(model.mobile) && model.mobile.length > 0
        ? model.phone.filter(a => a).map(p => ({ tel: p.url }))
        : [""];
    //Convert skype for redux-form
    v.skype =
      Array.isArray(model.skype) && model.skype.length > 0
        ? model.skype.filter(a => a).map(p => ({ text: p.url }))
        : [""];

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
    const { showModal, saveModel, model } = this.props;

    let promises = [];

    const addrs = values.addresses_private;

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

    return axios.all(promises).then(() => {
      //dispatch the action to save the model here
      const modelToSave = this.createModelToSave(values);

      modelToSave._id = model._id;

      return saveModel(modelToSave).then(response => {
        if (response.model && response.model._id) {
          showModal({
            type: MODAL_SAVED
          });
        }
      });
    });
  }

  render() {
    const {
      model = {},
      countries,
      showModal,
      errorMessage,
      isFetching,
      match: {
        params: { _id }
      }
    } = this.props;

    return (
      <div>
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
          showModal={showModal}
          countries={countries}
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
  //model: getDefaultModel(state),
  //isFetching: getDefaultModelIsFetching(state),
  //errorMessage: getDefaultModelErrorMessage(state),
  countries: getCountries(state),
  model: getModel(state, _id),
  isFetching: getModelIsFetching(state, _id),
  errorMessage: getModelErrorMessage(state, _id)
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchModel,
      saveModel,
      showModal,
      fetchCountries
    },
    dispatch
  );

ProfilePrivate = connect(mapStateToProps, mapDispatchToProps)(ProfilePrivate);

export default ProfilePrivate;
