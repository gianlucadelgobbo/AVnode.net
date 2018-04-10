import {h, render, Component} from 'preact';
import {reduxForm, Field} from "redux-form";
import {connect} from "preact-redux";
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants'
import {renderDropzoneInput} from "../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'
import {formValueSelector} from 'redux-form';

class ProfileImageForm extends Component {

    submitForm(data) {
        const {onSubmit, resetForm} = this.props;

        // reset form after submit
        return onSubmit(data)
            .then(() => {
                resetForm();
            });
    }

    render() {

        const {
            submitting,
            handleSubmit,
            showModal,
            images
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this.submitForm.bind(this))}>

                <Field
                    name="images"
                    component={renderDropzoneInput}
                    showModal={showModal}
                />

                <hr/>

                <button
                    type="submit"
                    disabled={submitting || !images || (images && !images.length)}
                    className="btn btn-primary btn-lg btn-block">
                    {submitting ? "Saving..." : "Save"}
                </button>

            </form>
        );
    }

}

/*
* formValueSelector is a "selector" API to make it easier to connect() to form values.
* It creates a selector function that accepts field names and returns corresponding values from the named form.
* */
const valueSelector = formValueSelector(FORM_NAME);

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    images: valueSelector(state, 'images')
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

ProfileImageForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileImageForm);

ProfileImageForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(ProfileImageForm);

export default ProfileImageForm;
