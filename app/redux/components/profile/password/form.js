import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputPassword, inputPasswordMeter} from "../../common/form/components";
import validate from './validate'
//import asyncValidate from './asyncValidate'

class ProfilePasswordForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="oldpassword"
                    component={inputPassword}
                    placeholder="Old password"
                />

                <hr/>

                <Field
                    name="password"
                    component={inputPassword}
                    placeholder="New Password"
                />

                <Field
                    name="confirmPassword"
                    component={inputPassword}
                    placeholder="Confirm Password"
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-lg btn-block">
                    {submitting ? "Saving..." : "Save"}
                </button>

            </form>
        );
    }

}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfilePasswordForm);
