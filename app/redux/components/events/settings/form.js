import React, { Component } from 'react';
import {reduxForm, Field} from "redux-form";
import {FORM_NAME} from './constants'
import {
    checkboxField,
    userAutocompleteSelect
} from "../../common/form/components";
import validate from './validate';

//import asyncValidate from './asyncValidate';

class EventPublicForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            onSubmit
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <h4>Settings</h4>

                <hr/>

                <Field
                    name="is_public"
                    component={checkboxField}
                    placeholder="Is public"
                />

                <Field
                    name="gallery_is_public"
                    component={checkboxField}
                    placeholder='Galleries upload is open to all AVnode users'
                />

                <Field
                    name="is_freezed"
                    component={checkboxField}
                    placeholder='Event is freezed, nobody can edit any information on the event'
                />

                <Field
                    name="users"
                    component={userAutocompleteSelect}
                    placeholder='Users'
                    multi={true}
                />

                <h4>Organization</h4>
                <hr/>

                <Field
                    name="program_builder"
                    component={checkboxField}
                    placeholder='Use Program Builder'
                />

                <Field
                    name="advanced_proposals_manager"
                    component={checkboxField}
                    placeholder='Use Program Manager'
                />

                <Field
                    name="call_manager"
                    component={checkboxField}
                    placeholder='Use Call to participate'
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

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses[]']
})(EventPublicForm);
