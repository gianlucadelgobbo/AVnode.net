import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {
    inputText,
    renderDatePicker,
    renderList,
    multiGoogleAddress,
    multiInputTel,
    multiInputText
} from "../../common/form/components";
import {locales, locales_labels} from '../../../../../config/default.json'
import validate from './validate';
import asyncValidate from './asyncValidate';
import {NAME, SURNAME, GENDER, LANGUAGE, BIRTHDAY, CITIZENSHIP, PRIVATE_ADDRESSES, PHONE, MOBILE, SKYPE} from "../../common/form/labels";

class ProfilePrivateForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            countries,
            onSubmit,
            showModal,
            
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder={NAME}
                />

                <Field
                    name="surname"
                    component={inputText}
                    placeholder={SURNAME}
                />

                <Field
                    name="gender"
                    component={renderList}
                    placeholder={GENDER}
                    options={[
                        {value: 'M', label: 'Male'},
                        {value: 'F', label: 'Female'},
                        {value: 'Others', label: 'Other'}
                    ]}
                />

                <Field
                    name="lang"
                    component={renderList}
                    placeholder={LANGUAGE}
                    options={locales.map(l => ({
                        value: l,
                        label: locales_labels[l]
                    }))}
                />

                <Field
                    name="birthday"
                    component={renderDatePicker}
                    placeholder={BIRTHDAY}
                />

                <br/>

                <Field
                    name="citizenship"
                    component={renderList}
                    placeholder={CITIZENSHIP}
                    multiple={true}
                    options={countries.map(c => ({
                        value: c.key,
                        label: c.name
                    }))}
                />

                <FieldArray
                    name="addresses_private"
                    component={multiGoogleAddress}
                    placeholder={PRIVATE_ADDRESSES}
                    showModal={showModal}
                    
                />

                <br/>

                <FieldArray
                    name="phone"
                    component={multiInputTel}
                    placeholder={PHONE}
                    title="Phone Number"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="mobile"
                    component={multiInputTel}
                    placeholder={MOBILE}
                    title="Mobile Number"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="skype"
                    component={multiInputText}
                    placeholder={SKYPE}
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

export default reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
    asyncValidate,
    asyncBlurFields: ["name", 'addresses_private[].text']
})(ProfilePrivateForm);