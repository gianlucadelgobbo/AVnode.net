import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { googleAutocompleteSelect } from "../../common/form/components";
//import validate from "./validate";
//import asyncValidate from "./asyncValidate";

class AddLocationForm extends Component {
  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="venue"
          label="locality"
          options={{
            types: ["establishment"],
          }}
          component={googleAutocompleteSelect}
          format={(v) => {
            const parseVenue = (v) => {
              return v.formatted_address;
            };

            return typeof v === "object" ? parseVenue(v) : v;
          }}
          isChild={true}
          placeholder="Venue or Address"
        />
        <hr />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-large btn-block"
        >
          {submitting ? "Saving..." : "Save"}
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  //validate,
  //asyncValidate,
})(AddLocationForm);
