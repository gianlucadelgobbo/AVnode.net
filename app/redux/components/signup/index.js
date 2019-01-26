import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
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
import { inputCheckbox } from "../common/form/components";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = { option: "single" };
  }

  componentDidMount() {
    //const {fetchModel} = this.props;
    //fetchModel();
  }

  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    return model;
  }

  createLatLongToSave = address => {
    return geocodeByAddress(address).then(results => getLatLng(results[0]));
  };

  onSubmit(values) {
    const { showModal, saveModel } = this.props;

    let data = Object.assign({}, values);

    console.log(data);

    if (!values.crewUrl) {
      data.subscribe = "single";
    } else {
      data.subscribe = "group";
    }

    data.addresses = [];

    data.addresses.push(values.addresses);

    data.addresses = data.addresses.map(a => {
      const originalString = a;
      const split = originalString.split(",");
      const country = split[split.length - 1].trim();
      const locality = split[0].trim();
      const geometry = a.geometry;
      return { originalString, locality, country, geometry };
    });

    let promises = [];

    const addrs = data.addresses;
    addrs.forEach(a => {
      promises.push(
        this.createLatLongToSave(a.originalString)
          .then(result => {
            a.geometry = result;
          })
          .catch(() => {
            console.log("ciao da google!");
          })
      );
    });

    return axios.all(promises).then(() => {
      const modelToSave = this.createModelToSave(values);
      modelToSave.addresses = addrs;
      // Add auth user _id
      modelToSave.id = "1";
      console.log(modelToSave);
      //dispatch the action to save the model here
      return saveModel(modelToSave).then(response => {
        if (response.model && response.model._id) {
          showModal({
            type: MODAL_SIGN_UP_SUCCESS
          });
        }
      });
    });
  }

  _onOptionChange(e) {
    this.setState({ option: e.target.value });
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
            _onOptionChange={this._onOptionChange.bind(this)}
            height={height}
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
  errorMessage: getModelErrorMessage(state, (_id = "1"))
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      saveModel,
      showModal
    },
    dispatch
  );

SignUp = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);

export default SignUp;
