import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { FORM_NAME } from "./constants";
import { inputText } from "../../common/form/components";
import validate from "./validate";
import { asyncValidate } from "./asyncValidate";
import {injectIntl} from 'react-intl';
import {PLAYLIST_NAME, PLAYLIST_URL, PLAYLIST_URL_PRE, PLAYLIST_URL_HELP} from "../../common/form/labels";

class AddFootageForm extends Component {

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
            placeholder={this.getIntlString({id:PLAYLIST_NAME})}
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

AddFootageForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["slug"]
})(AddFootageForm);

AddFootageForm = injectIntl(AddFootageForm);

export default AddFootageForm;
