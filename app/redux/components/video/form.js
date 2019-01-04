import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { renderDropzoneInput } from "../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";

class VideoForm extends Component {
  render() {
    const { submitting, handleSubmit, showModal, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="videos"
          component={renderDropzoneInput}
          placeholder="Videos"
          showModal={showModal}
        />

        <hr />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary btn-lg btn-block"
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
  validate,
  asyncValidate
  //asyncBlurFields: ['slug', 'addresses']
})(VideoForm);
