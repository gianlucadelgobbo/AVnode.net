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

class SignUpForm extends Component {
  submitForm(data) {
    const { onSubmit, reset } = this.props;

    // reset form after submit
    return onSubmit(data).then(() => {
      reset();
    });
  }

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
        />

        <Field
          name="stagename"
          component={inputText}
          placeholder="Stage name"
        />

        <Field
          name="slug"
          component={inputText}
          placeholder="Profile Url"
          help="To have your profile at https://avnode.net/mybeautyfulprofile, please insert mybeautifulprofile (lower case, no spaces, no special characters)"
        />

        <Field
          name="birthday"
          component={renderDatePicker}
          placeholder="birthday"
        />

        <Field name="email" component={inputEmail} placeholder="Email" />

        <Field
          name="addresses"
          component={singleGoogleCityCountry}
          placeholder="Addresses"
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
          className="btn btn-primary pull-right btn-lg"
        >
          {submitting ? "Saving..." : "Save"}
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

export default SignUpForm;
