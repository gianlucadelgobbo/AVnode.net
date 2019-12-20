import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText } from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import {
  PERFORMANCE_URL,
  PERFORMANCE_URL_PRE,
  PERFORMANCE_URL_HELP,
  TITLE
} from "../../common/form/labels";
import { injectIntl } from "react-intl";

class AddPerformanceForm extends Component {
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
          placeholder={this.getIntlString({ id: TITLE })}
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

AddPerformanceForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddPerformanceForm);

AddPerformanceForm = injectIntl(AddPerformanceForm);

export default AddPerformanceForm;