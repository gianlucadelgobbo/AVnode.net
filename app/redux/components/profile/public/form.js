import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, textareaMultitab} from "../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'

class ProfilePublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            aboutsTabs,
            aboutsLabels
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

                <Field
                    name="stagename"
                    component={inputText}
                    placeholder="Stage name"
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder="Profile url"
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultitab}
                    tabs={aboutsTabs}
                    labels={aboutsLabels}
                    placeholder="About"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary">
                    Save
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
    asyncValidate,
    asyncBlurFields: ['slug']
})(ProfilePublicForm);
