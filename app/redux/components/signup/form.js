import React, { Component } from "react";
import { reduxForm, Field, FieldArray } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FORM_NAME } from "./constants";
import {
  inputText,
  CollapsedPanel,
  renderDatePicker,
  inputEmail,
  singleGoogleCityCountry,
  inputPassword
} from "../common/form/components";
import validate from "./validate";
import { getFormSyncErrors } from "redux-form";
import {STAGE_NAME, PROFILE_URL, PROFILE_URL_PRE, PROFILE_URL_HELP, BIRTHDAY, ADDRESS} from "../common/form/labels";
import {injectIntl} from 'react-intl';

class SignUpForm extends Component {
  submitForm(data) {
    const { onSubmit, reset } = this.props;

    // reset form after submit
    return onSubmit(data).then(() => {
      reset();
    });
  }

  getIntlString = (obj) => {
    const {intl} = this.props;
    return intl.formatMessage(obj)
  };

  render() {
    const {
      submitting,
      handleSubmit,
      showModal,
      onSubmit,
      options,
      height,
      _onOptionChange,
      option
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.submitForm.bind(this))}>
        <Field
          name="subscribe"
          component={CollapsedPanel}
          placeholder="Subscribe as"
          options={options}
          height={height}
          _onOptionChange={e => _onOptionChange(e)}
          optionValue={option}
          pre="https://avnode.net/"
          help="To have your crew profile at https://avnode.net/mybeautyfulcrewprofile, please insert mybeautyfulcrewprofile (lower case, no spaces, no special characters)"
        />

        <Field
            name="stagename"
            component={inputText}
            placeholder={this.getIntlString({id:STAGE_NAME})}
        />

        <Field
            name="slug"
            component={inputText}
            placeholder={this.getIntlString({id:PROFILE_URL})}
            pre={this.getIntlString({ id: PROFILE_URL_PRE })}
            help={this.getIntlString({ id: PROFILE_URL_HELP })}

        />

        <Field
          name="birthday"
          component={renderDatePicker}
          placeholder={this.getIntlString({ id: BIRTHDAY })}
        />

        <Field name="email" component={inputEmail} placeholder="Email" />

        <Field
          name="addresses"
          component={singleGoogleCityCountry}
          placeholder={this.getIntlString({id:ADDRESS})}
          showModal={showModal}
        />

        <Field
          name="password"
          component={inputPassword}
          placeholder="Password"
        />

        <Field
          name="confirmPassword"
          component={inputPassword}
          placeholder="Confirm Password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary pull-right btn-lg mb-3"
        >
          {submitting ? "Saving..." : "SIGNUP"}
        </button>
      </form>
    );
  }
}

SignUpForm = reduxForm({
  form: FORM_NAME,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
  //asyncValidate,
  //asyncBlurFields: ['slug', 'city[].text']
})(SignUpForm);

//Get form's initial values from redux state here
const mapStateToProps = state => ({
  errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

SignUpForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm);

SignUpForm = injectIntl(SignUpForm);


export default SignUpForm;
