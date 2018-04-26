import {h,  Component} from 'preact';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderList} from "../../common/form/components";
//import validate from './validate';

class AddUsersForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit,
            users
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="Users"
                    component={renderList}
                    placeholder="Users"
                    options={users}
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary btn-large btn-block">
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
    //validate,
})(AddUsersForm);
