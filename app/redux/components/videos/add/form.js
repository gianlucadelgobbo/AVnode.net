import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText, renderDropzoneInput } from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  VIDEOS_NAME,
  VIDEOS_URL,
  VIDEOS_URL_PRE,
  VIDEOS_URL_HELP
} from "../../common/form/labels";

class AddVideosForm extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: VIDEOS_NAME })}
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

AddVideosForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddVideosForm);

AddVideosForm = injectIntl(AddVideosForm);

export default AddVideosForm;

