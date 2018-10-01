import React, {Component} from 'react';
import {reduxForm, Field} from "redux-form";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants';
import {userAutocompleteSelect} from "../../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {saveModel} from "../../../crews/members/actions";

class AddMembersForm extends Component {

    createModelToSave(values){
         //clone obj
         let model = Object.assign({}, values);

         model = model.members;

         return model;
    }

    submitForm(values) {
        const {saveModel} = this.props;
        const modelToSave = this.createModelToSave(values);
        return saveModel(modelToSave)
        .then((model) => {
            if(model && model.id){
                showModal({
                    type: MODAL_SAVED
                });
            }
        });

       
    }

    render() {

        const {
            submitting,
            handleSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(this.submitForm.bind(this))}>

                <Field
                    name="members"
                    component={userAutocompleteSelect}
                    placeholder="Members"
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

const mapDispatchToProps = dispatch => bindActionCreators({saveModel}, dispatch);

AddMembersForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddMembersForm);

AddMembersForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(AddMembersForm);

export default AddMembersForm;
