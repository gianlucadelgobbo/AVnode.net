import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {connect} from 'preact-redux';
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants'
import {
    renderList,
    inputText,
    textareaMultiTab,
    checkboxField, 
    multiInputText,
    multiCheckboxWithLabel
} from "../../common/form/components";
import validate from './validate';
import {getFormSyncErrors} from 'redux-form';
//import asyncValidate from './asyncValidate';

class PerformancePublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            aboutsTabs,
            aboutsLabels,
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
                    placeholder="Footage url"
                />

                <Field
                    name="title"
                    component={inputText}
                    placeholder="Footage name"
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={aboutsTabs}
                    labels={aboutsLabels}
                    errors={errors}
                    placeholder="About"
                />

                <br/>

                <Field
                    name="is_public"
                    component={checkboxField}
                    placeholder="Is public"
                />

                <Field
                    name="categories"
                    component={renderList}
                    placeholder="Category"
                    options={categories}
                />

                <FieldArray
                    name="users"
                    component={multiCheckboxWithLabel}
                    placeholder="Authors"
                    showModal={showModal}
                    className=""
                />

                <br/>

                <Field
                    name="price"
                    component={inputText}
                    placeholder="Price"
                />

                <Field
                    name="duration"
                    component={inputText}
                    placeholder="Duration"
                />

                <FieldArray
                    name="tech_art"
                    component={textareaMultiTab}
                    tabs={aboutsTabs}
                    labels={aboutsLabels}
                    placeholder="Technologies with the artists"
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="tech_req"
                    component={textareaMultiTab}
                    tabs={aboutsTabs}
                    labels={aboutsLabels}
                    placeholder="Technical requirements"
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
    //validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses[]']
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
