import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';

class AddCrewForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="stagename"
                    component={inputText}
                    placeholder="Name"
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder="Slug"
                />


                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-large btn-block">
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
    asyncBlurFields: ['slug']
})(AddCrewForm);
