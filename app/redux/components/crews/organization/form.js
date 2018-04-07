import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiGoogleAddress, multiInputTel} from "../../common/form/components";
import {locales, locales_labels} from '../../../../../config/default.json'
import validate from './validate';
import asyncValidate from './asyncValidate';

class CrewOrganizationForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            countries,
            onSubmit,
            showModal
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Name"
                />

                <Field
                    name="surname"
                    component={inputText}
                    placeholder="Surname"
                />

                <Field
                    name="gender"
                    component={renderList}
                    placeholder="Gender"
                    options={[
                        {value: 'M', label: 'Male'},
                        {value: 'F', label: 'Female'},
                        {value: 'Others', label: 'Other'}
                    ]}
                />

                <Field
                    name="lang"
                    component={renderList}
                    placeholder="Preferred language"
                    options={locales.map(l => ({
                        value: l,
                        label: locales_labels[l]
                    }))}
                />

                <Field
                    name="birthday"
                    component={renderDatePicker}
                    placeholder="Birthday"
                />

                <br/>

                <Field
                    name="citizenship"
                    component={renderList}
                    placeholder="Citizenship"
                />

                <FieldArray
                    name="addresses_private"
                    component={multiGoogleAddress}
                    placeholder="Organization addresses"
                    showModal={showModal}
                />

                <br/>

                <FieldArray
                    name="phone"
                    component={multiInputTel}
                    placeholder="phone"
                    title="Phone Number"
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
    //asyncBlurFields: ['slug', 'addresses']
})(CrewOrganizationForm);