import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants';
import {inputText, CollapsedPanel, renderDatePicker, inputEmail, googleAutocompleteSelect, inputPassword} from "../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {getFormSyncErrors} from 'redux-form';

class SignUpForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            showModal,
            onSubmit,
            options,
            height
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="subscribe"
                    component={CollapsedPanel}
                    placeholder="Subscribe as"
                    options={options}
                    height={height}          
                />

                <Field
                    name="stagename"
                    component={inputText}
                    placeholder="Stage name"
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder="Profile url"
                />  

                <Field
                    name="Birthdate"
                    component={renderDatePicker}
                    placeholder="Birthdate"
                />

                <Field
                    name="email"
                    component={inputEmail}
                    placeholder="Email"
                />

                <Field
                    name="city"
                    component={googleAutocompleteSelect}
                    placeholder="City"
                    showModal={showModal}
                />

                <Field
                    name="password"
                    component={inputPassword}
                    placeholder="Password"
                />  

                <Field
                    name="confirmpassword"
                    component={inputPassword}
                    placeholder="Confirm Password"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary pull-right btn-lg">
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
    validate,
    asyncValidate,
    asyncBlurFields: ['slug', 'addresses[].text']
})(SignUpForm);

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

SignUpForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpForm);

export default SignUpForm;