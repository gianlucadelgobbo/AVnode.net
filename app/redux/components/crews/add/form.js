import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText} from "../../common/form/components";
import validate from './validate';
import {CREW_NAME, CREW_URL, CREW_URL_PRE, CREW_URL_HELP} from "../../common/form/labels";
import {injectIntl} from 'react-intl';
import asyncValidate from './asyncValidate';

class AddCrewForm extends Component {

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
                    name="stagename"
                    component={inputText}
                    placeholder={this.getIntlString({id:CREW_NAME})}
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder={this.getIntlString({id:CREW_URL})}
                    pre={this.getIntlString({ id: CREW_URL_PRE })}
                    help={this.getIntlString({ id: CREW_URL_HELP })}
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

AddCrewForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['slug']
})(AddCrewForm);

AddCrewForm = injectIntl(AddCrewForm);


export default AddCrewForm;
