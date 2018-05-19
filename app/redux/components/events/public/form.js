import React, { Component } from 'react';
import {reduxForm, Field, FieldArray, getFormSyncErrors} from "redux-form";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FORM_NAME} from './constants'
import {
    renderList,
    multiSchedule,
    inputText,
    textareaMultiTab,
    multiInputUrl,
    multiInputEmail,
    multiInputTel,
} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';

class EventPublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit,
            categories,
            errors
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="categories"
                    component={renderList}
                    placeholder="Category"
                    multiple={true}
                    options={categories}
                />

                <FieldArray
                    name="schedule"
                    component={multiSchedule}
                    placeholder="Schedule"
                    showModal={showModal}
                />

                <br/>

                <Field
                    name="slug"
                    component={inputText}
                    placeholder="Event url"
                />

                <Field
                    name="title"
                    component={inputText}
                    placeholder="Title"
                />

                <FieldArray
                    name="subtitles"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="Subtitles"
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="About"
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="web"
                    component={multiInputUrl}
                    placeholder="Web"
                    title="Web"
                    showModal={showModal}
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="social"
                    component={multiInputUrl}
                    placeholder="Socials"
                    title="Socials"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="emails"
                    component={multiInputEmail}
                    placeholder="Emails"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="phones"
                    component={multiInputTel}
                    placeholder="Phones"
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


EventPublicForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['slug', 'schedule[].venue']
})(EventPublicForm);

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

EventPublicForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventPublicForm);

export default EventPublicForm;