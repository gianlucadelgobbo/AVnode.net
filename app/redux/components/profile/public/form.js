import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {FORM_NAME} from './constants';
import {inputText, textareaMultiTab, multiInputUrl, multiGoogleCityCountry} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';
import {getFormSyncErrors} from 'redux-form';
import {STAGE_NAME, PROFILE_URL, PROFILE_URL_HELP, ABOUT, WEB, SOCIAL, ADDRESS} from "../../common/form/labels";
import {injectIntl} from 'react-intl';

class ProfilePublicForm extends Component {

    getIntlString = (obj) => {
        const {intl} = this.props;
        return intl.formatMessage(obj)
    };

    render() {

        const {
            submitting,
            handleSubmit,
            tabs,
            labels,
            showModal,
            onSubmit,
            errors
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="stagename"
                    component={inputText}
                    placeholder={this.getIntlString({id:STAGE_NAME})}
                />

                <Field
                    name="slug"
                    component={inputText}
                    placeholder={this.getIntlString({id:PROFILE_URL})}
                />

                <FieldArray
                    name="abouts"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder={this.getIntlString({id:ABOUT})}
                    errors={errors}
                />

                <br/>

                <FieldArray
                    name="social"
                    component={multiInputUrl}
                    placeholder={this.getIntlString({id:SOCIAL})}
                    title="Socials"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="web"
                    component={multiInputUrl}
                    placeholder={this.getIntlString({id:WEB})}
                    title="Web"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="addresses"
                    component={multiGoogleCityCountry}
                    placeholder={this.getIntlString({id:ADDRESS})}
                    showModal={showModal}
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


ProfilePublicForm = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ['slug', 'addresses[].text']
})(ProfilePublicForm);

//Get form's initial values from redux state here
const mapStateToProps = (state) => ({
    errors: getFormSyncErrors(FORM_NAME)(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

ProfilePublicForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePublicForm);

ProfilePublicForm = injectIntl(ProfilePublicForm);

export default ProfilePublicForm;