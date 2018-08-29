import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {multiProgram} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {PROGRAM} from "../../common/form/labels";
import {injectIntl} from 'react-intl';

class EventProgramForm extends Component {

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
            categories
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldArray
                    name="program"
                    component={multiProgram}
                    placeholder={this.getIntlString({id:PROGRAM})}
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

EventProgramForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['slug', 'program[].venue']
})(EventProgramForm);

EventProgramForm = injectIntl(EventProgramForm);

export default EventProgramForm;