import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText } from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  GALLERIES_NAME,
  GALLERIES_URL,
  GALLERIES_URL_PRE,
  GALLERIES_URL_HELP
} from "../../common/form/labels";

class AddGalleriesForm extends Component {

  getIntlString = (obj) => {
    const {intl} = this.props;
    return intl.formatMessage(obj)
  };

  render() {
    const { submitting, handleSubmit, onSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="title"
          component={inputText}
          placeholder={this.getIntlString({ id: GALLERIES_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: GALLERIES_URL })}
          pre={this.getIntlString({ id: GALLERIES_URL_PRE })}
          help={this.getIntlString({ id: GALLERIES_URL_HELP })}
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

AddGalleriesForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddGalleriesForm);

AddGalleriesForm = injectIntl(AddGalleriesForm);

export default AddGalleriesForm;
