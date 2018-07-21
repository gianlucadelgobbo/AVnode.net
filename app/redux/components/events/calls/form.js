import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {
    multiCall,
} from "../../common/form/components";
import validate from './validate';
import asyncValidate from "./asyncValidate";
import {CALLS} from "../../common/form/labels";
import {injectIntl} from 'react-intl';

class EventCallsForm extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit,
            categories,
            showModal,
            tabs,
            labels,
            labelsShort
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <FieldArray
                    name="calls"
                    component={multiCall}
                    placeholder={this.getIntlString({id:CALLS})}
                    showModal={showModal}
                    categories={categories}
                    tabs={tabs}
                    labels={labelsShort}
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

EventCallsForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['calls[].slug']
})(EventCallsForm);

EventCallsForm = injectIntl(EventCallsForm);

export default EventCallsForm;
