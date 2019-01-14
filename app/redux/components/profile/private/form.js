import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { FORM_NAME } from "./constants";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  inputText,
  renderDatePicker,
  renderList,
  multiGoogleAddress,
  multiInputTel,
  multiInputText
} from "../../common/form/components";
import { locales, locales_labels } from "../../../../../config/default.json";
import validate from "./validate";
import asyncValidate from "./asyncValidate";
import { getFormSyncErrors } from "redux-form";
import {
  NAME,
  SURNAME,
  GENDER,
  LANGUAGE,
  BIRTHDAY,
  CITIZENSHIP,
  PRIVATE_ADDRESS,
  PHONE,
  MOBILE,
  SKYPE
} from "../../common/form/labels";
import { injectIntl } from "react-intl";

class ProfilePrivateForm extends Component {
  getIntlString = obj => {
    const { intl } = this.props;
    return intl.formatMessage(obj);
  };

  render() {
    const {
      submitting,
      handleSubmit,
      countries,
      onSubmit,
      showModal
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="name"
          component={inputText}
          placeholder={this.getIntlString({ id: NAME })}
        />

        <Field
          name="surname"
          component={inputText}
          placeholder={this.getIntlString({ id: SURNAME })}
        />

        <Field
          name="gender"
          component={renderList}
          placeholder={this.getIntlString({ id: GENDER })}
          options={[
            { value: "M", label: "Male" },
            { value: "F", label: "Female" },
            { value: "Others", label: "Other" }
          ]}
        />

        <Field
          name="lang"
          component={renderList}
          placeholder={this.getIntlString({ id: LANGUAGE })}
          options={locales.map(l => ({
            value: l,
            label: locales_labels[l]
          }))}
        />

        <Field
          name="birthday"
          component={renderDatePicker}
          placeholder={this.getIntlString({ id: BIRTHDAY })}
        />

        <br />

        <Field
          name="citizenship"
          component={renderList}
          placeholder={this.getIntlString({ id: CITIZENSHIP })}
          multiple={true}
          options={countries.map(c => ({
            value: c.key,
            label: c.name
          }))}
        />

        <FieldArray
          name="addresses_private"
          component={multiGoogleAddress}
          placeholder={this.getIntlString({ id: PRIVATE_ADDRESS })}
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="phone"
          component={multiInputTel}
          placeholder={this.getIntlString({ id: PHONE })}
          title="Phone Number"
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="mobile"
          component={multiInputTel}
          placeholder={this.getIntlString({ id: MOBILE })}
          title="Mobile Number"
          showModal={showModal}
        />

        <br />

        <FieldArray
          name="skype"
          component={multiInputText}
          placeholder={this.getIntlString({ id: SKYPE })}
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

ProfilePrivateForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ["name", "addresses_private[].text"]
})(ProfilePrivateForm);

//Get form's initial values from redux state here
const mapStateToProps = state => ({
  errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

ProfilePrivateForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePrivateForm);

ProfilePrivateForm = injectIntl(ProfilePrivateForm);

export default ProfilePrivateForm;
