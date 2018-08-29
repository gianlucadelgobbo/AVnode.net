import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants';
import {multiInputEmailWithDetails} from "../../common/form/components";
import validate from './validate';
import {EMAILS} from "../../common/form/labels";
import {injectIntl} from 'react-intl';

class ProfileEmailsForm extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

    render() {

        const {
            submitting,
            handleSubmit,
            showModal,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldArray
                    name="emails"
                    component={multiInputEmailWithDetails}
                    placeholder={this.getIntlString({id:EMAILS})}
                    showModal={showModal}
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

ProfileEmailsForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate
})(ProfileEmailsForm);

ProfileEmailsForm = injectIntl(ProfileEmailsForm);

export default ProfileEmailsForm;