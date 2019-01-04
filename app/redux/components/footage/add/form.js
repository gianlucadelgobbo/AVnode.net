import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText, renderDropzoneInput } from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";

class AddFootageForm extends Component {
  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field name="name" component={inputText} placeholder="Title" />
        <Field name="slug" component={inputText} placeholder="Slug" />
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
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddFootageForm);
