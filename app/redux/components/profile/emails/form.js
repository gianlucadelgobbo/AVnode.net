import React, { Component } from "react";
import { FieldArray, reduxForm } from "redux-form";
import { FORM_NAME } from "./constants";
import { multiInputEmailWithDetails } from "../../common/form/components";
import validate from "./validate";
import { EMAILS } from "../../common/form/labels";
import { injectIntl } from "react-intl";
import asyncValidate from "./asyncValidate";

class ProfileEmailsForm extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  extractModelEmails() {
    let { model = {} } = this.props;
    let { emails = [] } = model;

    emails = emails.map(e => e.email);
    return emails;
  }

  render() {
    const {
      submitting,
      handleSubmit,
      showModal,
      onSubmit,
      verifyEmail
    } = this.props;

    const emails = this.extractModelEmails();

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldArray
          name="emails"
          component={multiInputEmailWithDetails}
          placeholder={this.getIntlString({ id: EMAILS })}
          showModal={showModal}
          onVerifyEmail={verifyEmail}
          modelEmails={emails}
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

ProfileEmailsForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['emails[].email'],
  //asyncFields: ['emails[].email']
})(ProfileEmailsForm);

ProfileEmailsForm = injectIntl(ProfileEmailsForm);

export default ProfileEmailsForm;
