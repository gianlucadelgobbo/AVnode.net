import {h, render, Component} from 'preact';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiGoogleAddress, multiInputTel, multiInputEmailWithDetails, renderListRadio} from "../../common/form/components";
import {locales, locales_labels} from '../../../../../config/default.json'
import validate from './validate';
import asyncValidate from './asyncValidate';

class CrewOrganizationForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            categories,
            onSubmit,
            showModal
        } = this.props;

        const pippo = {
            test: ''
          }

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Name"
                />

                <Field
                    name="foundation_year"
                    component={renderDatePicker}
                    placeholder="Add/Edit fondation year"
                />

                <Field
                    name="type"
                    component={renderList}
                    placeholder="Organization Type"
                    options={categories}
                />

                <br/>

                <FieldArray
                    name="emails"
                    component={multiInputEmailWithDetails}
                    placeholder="Emails"
                    showModal={showModal}
                />
                
                <br/>

                <FieldArray
                    name="addresses_private"
                    component={multiGoogleAddress}
                    placeholder="Organization addresses"
                    showModal={showModal}
                />

                <br/>

                <Field
                    name="pic_code"
                    component={inputText}
                    placeholder="Organisation PIC Code"
                />

                <br/>

                <Field
                    name="vat_number"
                    component={inputText}
                    placeholder="Organisation vat number"
                />

                <br/>

                <Field
                    name="able_to_recuperate_vat"
                    component={renderListRadio}
                    placeholder="Able to recuperate VAT?"
                    options={[
                                ['vat-yes', 'Yes'],
                                ['vat-no', 'No']
                            ]}
                    value=""
                />

                <br/>

                <Field
                    name="official_registration_number"
                    component={inputText}
                    placeholder="Organisation official registration number"
                /> 

                <br/>

                <Field
                    name="legal_representative_title"
                    component={renderList}
                    placeholder="Organisation legal representative title"
                    options={[
                                {value: 'Mr', label: 'Mr'},
                                {value: 'Miss', label: 'Miss'},
                            ]}
                />  

                 <br/>

                <Field
                    name="legal_representative_role"
                    component={inputText}
                    placeholder="Organisation legal representative role"
                />

                <br/>

                <Field
                    name="legal_representative_name"
                    component={inputText}
                    placeholder="Organisation legal representative name"
                />

                <br/>

                <Field
                    name="legal_representative_surname"
                    component={inputText}
                    placeholder="Organisation legal representative surname"
                /> 

                <br/>

                <FieldArray
                    name="email"
                    component={multiInputEmailWithDetails}
                    placeholder="Organisation legal representative email"
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
    //validate,
    //asyncValidate,
    //asyncBlurFields: ['slug', 'addresses']
})(CrewOrganizationForm);