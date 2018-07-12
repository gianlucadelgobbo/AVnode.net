import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {connect} from 'react-redux'
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants'
import {
    renderList,
    inputText,
    textareaMultiTab,
    checkboxField, 
    multiInputText,
    fieldWithLabel
} from "../../common/form/components";
import validate from './validate';
import {getFormSyncErrors} from 'redux-form';
import asyncValidate from './asyncValidate';
import {PERFORMANCE_URL, TITLE, ABOUT, IS_PUBLIC, CATEGORY, AUTHORS, PRICE, DURATION, TECHNOLOGIES_ARTISTS, TECNICAL_REQUIREMENT} from "../../common/form/labels";

class PerformancePublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit,
            errors,
            categories
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="slug"
                    component={inputText}
                    placeholder={PERFORMANCE_URL}
                />

                <Field
                    name="title"
                    component={inputText}
                    placeholder={TITLE}
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    errors={errors}
                    placeholder={ABOUT}
                />

                <br/>

                <Field
                    name="is_public"
                    component={checkboxField}
                    placeholder={IS_PUBLIC}
                />

                <Field
                    name="categories"
                    component={renderList}
                    placeholder={CATEGORY}
                    multiple={true}
                    options={categories}
                />

                <FieldArray
                    name="users"
                    component={fieldWithLabel}
                    placeholder={AUTHORS}
                    showModal={showModal}
                    className=""
                />

                <br/>

                <Field
                    name="price"
                    component={inputText}
                    placeholder={PRICE}
                />

                <Field
                    name="duration"
                    component={inputText}
                    placeholder={DURATION}
                />

                <FieldArray
                    name="tech_art"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder={TECHNOLOGIES_ARTISTS}
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="tech_req"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder={TECNICAL_REQUIREMENT}
                    errors={errors}
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

PerformancePublicForm =  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['slug']
})(PerformancePublicForm);

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

PerformancePublicForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(PerformancePublicForm);

export default PerformancePublicForm;
