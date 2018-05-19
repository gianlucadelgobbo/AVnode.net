import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiGoogleAddress, multiInputTel} from "../../common/form/components";
import {locales, locales_labels} from '../../../../../config/default.json'
import validate from './validate';
import asyncValidate from './asyncValidate';

class CrewMembersForm extends Component {

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
                    name="member"
                    component={inputText}
                    placeholder="Member"
                />

                <FieldArray
                    name="addresses_private"
                    component={multiGoogleAddress}
                    placeholder="Members addresses"
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
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(CrewMembersForm);