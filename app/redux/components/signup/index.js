import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { showModal } from "../modal/actions";
import { bindActionCreators } from "redux";
import { MODAL_SIGN_UP_SUCCESS, MODAL_SAVED } from "../modal/constants";
import { OPTIONS } from "./constants";
import { saveModel } from "./actions";
import ErrorMessage from "../errorMessage";
import { getModelErrorMessage } from "./selectors";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import axios from "axios";
import moment from "moment";
import { DATE_FORMAT } from "../../conf";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { option: "single", startDate: "" };
  }

  componentDidMount() {
    //const {fetchModel} = this.props;
    //fetchModel();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //console.log("createModelToSave");
    //console.log(values);

    const { startDate } = this.state;
    //clone obj
    let model = Object.assign({}, values);

    model.birthday = startDate;

    // Convert addresses
    model.addresses = model.addresses.map((a) => {
      //return { originalString, locality, country, geometry };
      return a.loc;
    });

    return model;
  }

  createLatLongToSave = (address) => {
    return geocodeByAddress(address)
      .then(function(results) {
        return getLatLng(results[0]).then((geometry) => [results, geometry]); // function(b) { return [resultA, b] }
      })
      .then(function([results, geometry]) {
        let loc = {};
        results[0].address_components.forEach((address_component) => {
          if (address_component.types.indexOf("country") !== -1)
            loc.country = address_component.long_name;
          if (address_component.types.indexOf("locality") !== -1)
            loc.locality = address_component.long_name;
        });
        if (!loc.locality) {
          results[0].address_components.forEach((address_component) => {
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

  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};
    return v;
  }

  onSubmit(values) {
    const { showModal, saveModel } = this.props;

    let data = Object.assign({}, values);

    if (!values.crewUrl) {
      data.subscribe = "single";
    } else {
      data.subscribe = "group";
    }

    /* data.addresses = [];

    data.addresses.push(values.addresses);

    data.addresses = data.addresses.map(a => {
      const formatted_address = a;
      const split = formatted_address.split(",");
      const country = split[split.length - 1].trim();
      const locality = split[split.length - 3].trim();
      const geometry = a.geometry;
      return { formatted_address, locality, country, geometry };
    }); */

    let promises = [];

    const addrs = [{ text: values.addresses }];
    addrs.forEach((a) => {
      promises.push(
        this.createLatLongToSave(a.text)
          .then((result) => {
            // add to a model
            a.loc = result;
          })
          .catch(() => {
            console.log("ciao da google!");
          })
      );
    });

    return axios.all(promises).then(() => {
      data.addresses = addrs;
      const modelToSave = this.createModelToSave(data);
      // Add auth user _id
      modelToSave.id = "1";
      //dispatch the action to save the model here
      //console.log(modelToSave);
      return saveModel(modelToSave).then((response) => {
        if (response && response.model && response.model._id) {
          showModal({
            type: MODAL_SIGN_UP_SUCCESS,
          });
        }
        return response;
      });
    });
  }

  _onOptionChange(e) {
    this.setState({ option: e.target.value });
  }
  handleChange(value) {
    //console.log(value);
    this.setState({ startDate: moment(value).format(DATE_FORMAT) });
  }

  render() {
    const { showModal, errorMessage } = this.props;
    const { option } = this.state;
    const height = 50;
    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}

          <Form
            onSubmit={this.onSubmit.bind(this)}
            showModal={showModal}
            options={OPTIONS}
            option={option}
            handleChange={this.handleChange.bind(this)}
            _onOptionChange={this._onOptionChange.bind(this)}
            height={height}
            initialValues={this.getInitialValues()}
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
      params: { _id },
    },
  }
) => ({
  errorMessage: getModelErrorMessage(state, (_id = "1")),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveModel,
      showModal,
    },
    dispatch
  );

SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUp;
