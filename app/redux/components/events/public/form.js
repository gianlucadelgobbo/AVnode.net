import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {
    renderList,
    renderDatePicker,
    renderTimePicker
} from "../../common/form/components";
import validate from './validate';
//import asyncValidate from './asyncValidate';

class EventPublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            aboutsTabs,
            aboutsLabels,
            showModal,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="categories"
                    component={renderList}
                    placeholder="Category"
                    options={[
                        {value: 'cat-1', label: 'Category #1'},
                        {value: 'cat-2', label: 'Category #2'},
                        {value: 'cat-3', label: 'Category #2'}
                    ]}
                />

                <Field
                    name="date"
                    component={renderDatePicker}
                    placeholder="Date"
                />

                <Field
                    name="starttime"
                    component={renderTimePicker}
                    placeholder="Start time"
                />

                <Field
                    name="endtime"
                    component={renderTimePicker}
                    placeholder="End time"
                />

                {/*<Field*/}
                    {/*name="stagename"*/}
                    {/*component={inputText}*/}
                    {/*placeholder="Stage name"*/}
                {/*/>*/}

                {/*<Field*/}
                    {/*name="slug"*/}
                    {/*component={inputText}*/}
                    {/*placeholder="Profile url"*/}
                {/*/>*/}

                {/*<FieldArray*/}
                    {/*name="abouts"*/}
                    {/*component={textareaMultiTab}*/}
                    {/*tabs={aboutsTabs}*/}
                    {/*labels={aboutsLabels}*/}
                    {/*placeholder="About"*/}
                {/*/>*/}

                {/*<br/>*/}

                {/*<FieldArray*/}
                    {/*name="social"*/}
                    {/*component={multiInputUrl}*/}
                    {/*placeholder="Socials"*/}
                    {/*title="Socials"*/}
                    {/*showModal={showModal}*/}
                {/*/>*/}

                {/*<br/>*/}

                {/*<FieldArray*/}
                    {/*name="web"*/}
                    {/*component={multiInputUrl}*/}
                    {/*placeholder="Web"*/}
                    {/*title="Web"*/}
                    {/*showModal={showModal}*/}
                {/*/>*/}

                {/*<br/>*/}

                {/*<FieldArray*/}
                    {/*name="addresses"*/}
                    {/*component={multiGoogleCityCountry}*/}
                    {/*//component={multiInputText}*/}
                    {/*placeholder="Address"*/}
                    {/*showModal={showModal}*/}
                {/*/>*/}

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
})(EventPublicForm);
