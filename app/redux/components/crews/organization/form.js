import React, { Component } from 'react';
import {reduxForm, Field, FieldArray} from "redux-form";
import {FORM_NAME} from './constants'
import {inputText, renderDatePicker, renderList, multiGoogleAddress, 
        multiInputTel, multiInputEmailWithDetails, 
        renderListRadio, renderDropzoneInput, 
        textareaMultiTab, textarea, multiContacts, multiActivities, multiLegalOrganization} from "../../common/form/components";
import validate from './validate';
import asyncValidate from './asyncValidate';

class CrewOrganizationForm extends Component {

    render() {

        const {
            submitting,
            handleSubmit,
            categories,
            tabs,
            labels,
            seasons,
            onSubmit,
            showModal
        } = this.props;

        return (
            <form onSubmit={handleSubmit(onSubmit)}>

                <Field
                    name="name"
                    component={inputText}
                    placeholder="Organization Name"
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
                    placeholder="Organization PIC Code"
                />

                <br/>

                <Field
                    name="vat_number"
                    component={inputText}
                    placeholder="Organization vat number"
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
                    placeholder="Organization official registration number"
                /> 

                <br/>

                <FieldArray
                    name="legal_representative_organization"
                    component={multiLegalOrganization}
                    placeholder="Organization legal representative"
                    showModal={showModal}
                />  

                <br/>

                 <Field
                    name="pdf_statute"
                    component={renderDropzoneInput}
                    showModal={showModal}
                    placeholder="Organization statute (pdf only)"
                    className="enableBorder"
                />  

                <br/>

                 <Field
                    name="pdf_members"
                    component={renderDropzoneInput}
                    showModal={showModal}
                    placeholder="Organization members cv (pdf only)"
                    className="enableBorder"
                /> 

                <br/>

                 <Field
                    name="pdf_activity_report"
                    component={renderDropzoneInput}
                    showModal={showModal}
                    placeholder="Organization Activity Report (pdf only)"
                    className="enableBorder"
                />  
                                
                <br/> 

                <Field
                    name="permanent_employees"
                    component={inputText}
                    placeholder="Organization permanent employees"
                />     

                <br/> 

                <Field
                    name="permanent_employees_avnode"
                    component={inputText}
                    placeholder="Organization permanent employees AVnode"
                />      

                <br/> 

                <Field
                    name="temporary_employees"
                    component={inputText}
                    placeholder="Organization temporary employees"
                />      

                <br/> 

                <Field
                    name="temporary_employees_avnode"
                    component={inputText}
                    placeholder="Organization temporary employees AVnode"
                />
                
                <br/>    
            
                <FieldArray
                    name="relevance_in_the_project"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="Organization relevance in the project"
                />

                <br/>    

                <FieldArray
                    name="emerging_artists_definition"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="Organization emerging artists definition"
                />

                <br/>    

                <FieldArray
                    name="eu_grants_received_in_the_last_3_years"
                    component={textareaMultiTab}
                    tabs={tabs}
                    labels={labels}
                    placeholder="EU grants received in the last 3 years"
                /> 

                <br/>    

                <Field
                    name="annual_turnover_in_euro"
                    component={inputText}
                    placeholder="Organization annual turnover in euro"
                />    

                <br/>    

                <FieldArray
                    name="contacts"
                    component={multiContacts}
                    placeholder="Organization contacts (multiple)"
                    showModal={showModal}
                    tabs={tabs}
                    labels={labels}
                />  

                <br/> 

                <FieldArray
                    name="activities"
                    component={multiActivities}
                    placeholder="Organization activities (multiple)"
                    showModal={showModal}
                    tabs={tabs}
                    labels={labels}
                    seasons={seasons}
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
    //asyncBlurFields: ['slug', 'addresses']
})(CrewOrganizationForm);