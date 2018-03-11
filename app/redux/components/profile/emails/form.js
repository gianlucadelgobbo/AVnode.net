import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {multiInputEmail} from "../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'

class ProfileEmailsForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            showModal
        } = this.props;

        return (
            <form onSubmit={handleSubmit}>

                <FieldArray
                    name="emails"
                    component={multiInputEmail}
                    placeholder="Emails"
                    showModal={showModal}
                />

                <br/>

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
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfileEmailsForm);
