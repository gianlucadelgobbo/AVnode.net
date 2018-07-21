import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputPassword, inputPasswordMeter} from "../../common/form/components";
import validate from './validate';
import {OLD_PASSWORD, NEW_PASSWORD, CONFIRM_PASSWORD} from "../../common/form/labels";
import {injectIntl} from 'react-intl';

class ProfilePasswordForm extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

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
                    placeholder={this.getIntlString({id:OLD_PASSWORD})}
                />

                <hr/>

                <Field
                    name="password"
                    component={inputPassword}
                    placeholder={this.getIntlString({id:NEW_PASSWORD})}
                />

                <Field
                    name="confirmPassword"
                    component={inputPassword}
                    placeholder={this.getIntlString({id:CONFIRM_PASSWORD})}
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
ProfilePasswordForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate
})(ProfilePasswordForm);

ProfilePasswordForm = injectIntl(ProfilePasswordForm);

export default ProfilePasswordForm;