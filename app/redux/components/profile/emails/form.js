import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants';
import {multiInputEmailWithDetails} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {EMAILS} from "../../common/form/labels";

class ProfileEmailsForm extends Component {

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
                    placeholder={EMAILS}
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

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfileEmailsForm);
