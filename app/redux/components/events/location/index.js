import React, { Component } from "react";
import Form from "./form";
import { connect } from "react-redux";
import { getModel, getModelErrorMessage } from "../selectors";
import { showModal, hideModal } from "../../modal/actions";
import { bindActionCreators } from "redux";
import { saveModel } from "../public/actions";
import ErrorMessage from "../../errorMessage";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

class AddLocation extends Component {
  // Convert form values to API model
  createModelToSave(values) {
    //clone obj
    let model = Object.assign({}, values);

    return model;
  }

  // Modify model from API to create form initial values
  getInitialValues() {
    const { model } = this.props;

    if (!model) {
      return {};
    }

    let v = {};

    return v;
  }

  createLatLongToSave = (address) => {
    if (address && typeof address !== "object") {
      let addressSplitted = address.split(",");
      return geocodeByAddress(address)
        .then(function(results) {
          return getLatLng(results[0]).then((geometry) => [results, geometry]); // function(b) { return [resultA, b] }
        })
        .then(function([results, geometry]) {
          let venue = {};
          let loc = {};
          console.log(geometry);
          results[0].address_components.forEach((address_component) => {
            if (address_component.types.indexOf("country") !== -1)
              loc.country = address_component.long_name;
            if (address_component.types.indexOf("locality") !== -1)
              loc.locality = address_component.long_name;
          });
          loc.formatted_address = results[0].formatted_address;
          loc.geometry = geometry;
          venue.location = loc;
          venue.name = addressSplitted[0];
          return venue;
        });
    }
  };

  onSubmit(values) {
    const { history, saveModel, hideModal } = this.props;
    const modelToSave = this.createModelToSave(values);

    modelToSave.id = "2";

    let venue = values.venue;

    this.createLatLongToSave(venue)
      .then((result) => {
        // add to a model
        venue = {
          location: result.location,
          name: result.name,
        };

        modelToSave.schedule = [{ venue: venue }];

        //dispatch the action to save the model here
        return hideModal();
      })
      .catch(() => {
        console.log("ciao da google!");
      });
  }

  render() {
    const { showModal, errorMessage, _id } = this.props;
    console.log(_id);
    return (
      <div className="row">
        <div className="col-md-12">
          {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
          <Form
            initialValues={this.getInitialValues()}
            onSubmit={this.onSubmit.bind(this)}
            showModal={showModal}
          />
        </div>
      </div>
    );
  }
}

//Get form's initial values from redux state here
const mapStateToProps = (state, _id) => ({
  model: getModel(state),
  errorMessage: getModelErrorMessage(state, (_id = "2")),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      showModal,
      saveModel,
      hideModal,
    },
    dispatch
  );

AddLocation = connect(mapStateToProps, mapDispatchToProps)(AddLocation);

export default AddLocation;
