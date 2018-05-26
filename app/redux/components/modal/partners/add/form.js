import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants'
import {userAutocompleteSelect, renderList} from "../../../common/form/components";
import validate from './validate'
import asyncValidate from './asyncValidate'

class AddPartnerForm extends Component {

    submitForm(data) {
        const {onSubmit, reset} = this.props;

        // reset form after submit
        return onSubmit(data)
            .then(() => {
                reset();
            });
    }

    render() {

        const {
            submitting,
            handleSubmit,
            categories
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this.submitForm.bind(this))}>

                <Field
                    name="partner"
                    component={userAutocompleteSelect}
                    placeholder="Partner"
                />

                <Field
                    name="category"
                    component={renderList}
                    placeholder="Category"
                    options={categories}
                />

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


//Get form's initial values from redux state here
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

AddPartnerForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPartnerForm);

AddPartnerForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(AddPartnerForm);

export default AddPartnerForm;
