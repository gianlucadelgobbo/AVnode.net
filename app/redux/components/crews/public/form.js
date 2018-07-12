import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {
    renderList,
    inputText,
    textareaMultiTab,
    checkboxField, multiInputText, multiGoogleCityCountry, multiInputUrl,
} from "../../common/form/components";
import validate from './validate';
import {CREW_NAME, CREW_URL, ABOUT, WEB, SOCIAL} from "../../common/form/labels";
//import asyncValidate from './asyncValidate';

class CrewPublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit,
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="slug"
                    component={inputText}
                    placeholder={CREW_URL}
                />

                <Field
                    name="stagename"
                    component={inputText}
                    placeholder={CREW_NAME}
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder={ABOUT}
                />

                <br/>

                <FieldArray
                    name="social"
                    component={multiInputUrl}
                    placeholder={SOCIAL}
                    title="Socials"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="web"
                    component={multiInputUrl}
                    placeholder={WEB}
                    title="Web"
                    showModal={showModal}
                />

                <br/>

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
    //asyncBlurFields: ['slug', 'addresses[]']
})(CrewPublicForm);
