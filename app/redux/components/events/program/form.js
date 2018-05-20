import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {multiProgram} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate'

class EventProgramForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            showModal,
            onSubmit,
            categories
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldArray
                    name="program"
                    component={multiProgram}
                    placeholder="Program"
                    showModal={showModal}
                    categories={categories}
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
    asyncBlurFields: ['slug', 'program[].venue']
})(EventProgramForm);
