import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText } from "../../common/form/components";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { injectIntl } from "react-intl";
import {
  NEWS_NAME,
  NEWS_URL,
  NEWS_URL_PRE,
  NEWS_URL_HELP
} from "../../common/form/labels";

class AddNewsForm extends Component {

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
          placeholder={this.getIntlString({ id: NEWS_NAME })}
        />

        <Field
          name="slug"
          component={inputText}
          placeholder={this.getIntlString({ id: NEWS_URL })}
          pre={this.getIntlString({ id: NEWS_URL_PRE })}
          help={this.getIntlString({ id: NEWS_URL_HELP })}
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

AddNewsForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddNewsForm);

AddNewsForm = injectIntl(AddNewsForm);

export default AddNewsForm;