import {h, render, Component} from 'preact';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText} from "../../common/form/components";
import validate from './validate';


class AddEventForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)} className="row">

                <div className="col-md-8">
                    <Field
                        name="name"
                        component={inputText}
                        placeholder="Name"
                    />
                </div>

                <div className="col-md-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary btn-large btn-block">
                        {submitting ? "Saving..." : "Save"}
                    </button>
                </div>

            </form>

        );
    }

}

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
})(AddEventForm);
