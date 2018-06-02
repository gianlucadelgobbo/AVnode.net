import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants';
import {
    renderList,
    inputText,
    textareaMultiTab, tagsInput,
    checkboxField, multiInputText, multiGoogleCityCountry, multiInputUrl, fieldWithLabel
} from "../../common/form/components";
import validate from './validate';
//import asyncValidate from './asyncValidate';

class FootagePublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit,
            delimiters,
            //handleDelete,
            tags
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>


                <Field
                    name="title"
                    component={inputText}
                    placeholder="Footage name"
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder="Url name"
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="About"
                />

                <br/>

                <FieldArray
                    name="users"
                    component={fieldWithLabel}
                    placeholder="Authors"
                    showModal={showModal}
                    className=""
                />

                <br/>

                <Field
                    name="tags"
                    component={tagsInput}
                    tags={tags}
                    delimiters={delimiters}
                    //handleDelete={handleDelete}
                    placeholder="Tags"
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
})(FootagePublicForm);
