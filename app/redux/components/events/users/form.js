import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
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

class EventUsersForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

               {/* <Field
                    name="categories"
                    component={renderList}
                    placeholder="Category"
                    options={[
                        {value: 'cat-1', label: 'Category #1'},
                        {value: 'cat-2', label: 'Category #2'},
                        {value: 'cat-3', label: 'Category #2'}
                    ]}
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
                />

                <br/>

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="About"
                />

                <br/>

                <FieldArray
                    name="web"
                    component={multiInputUrl}
                    placeholder="Web"
                    title="Web"
                    showModal={showModal}
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

                <br/>*/}

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
})(EventUsersForm);
