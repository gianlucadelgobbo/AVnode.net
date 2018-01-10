import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
//import Languages from '../language/Languages';
// import Place from '../place/PlaceContainer';
import AddressesOrganization from '../place/AddressesOrganization';

import OrgContact from './OrgContact';
import OrgActivity from './OrgActivity';
import OrgTypes from './OrgTypes';
import Links from '../link/Links';
import LinksSocial from '../link/LinksSocial';
import LinksTel from '../link/LinksTel';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {
    fetchCountries,
    editCrew
} from '../../reducers/actions';

Moment.locale('en');
momentLocalizer();

let CrewOrganizationForm = props => {
  const { 
    handleSubmit, 
    editCrew, 
    crew, 
    user,
    fetchCountries, 
    intl 
  } = props;

  const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
    <DateTimePicker
        onChange={onChange}
        format="YYYY"
        time={showTime}
        value={!value ? null : new Date(value)}
    />;
  if (!user._countries) {
    fetchCountries();
  }
  return (
<div>
    <div className="container-fluid">
        <Match>
            {({ url }) => <CrewNav url={url} crew={props.crew} />}
        </Match>
    </div>
    <Layout>
        <legend>
            <FormattedMessage
                id="crew"
                defaultMessage="Crew"
            />:
            &nbsp;{(props.crew) ? props.crew.stagename : null}
        </legend>
        <form onSubmit={handleSubmit(editCrew)}>
            <Field
                name="_id"
                component="input"
                type="hidden"
            />
            <h3>
                <FormattedMessage
                    id="org_extradata_title"
                    defaultMessage="Organization Extra Data"
                />
            </h3>
            <div className="form-group">
                <label htmlFor="org_name">
                    <FormattedMessage
                        id="org_name"
                        defaultMessage="Organisation legal name"
                    />
                </label>
                &nbsp;
    <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_name"
                    component="input"
                    type="text"
                />
            </div>
            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="org_foundation_year">
                        <FormattedMessage
                            id="org_foundation_year"
                            defaultMessage="Organisation foundation year"
                        />
                    </label>
                    &nbsp;
                        <span className="badge badge-success">
                        <FormattedMessage
                            id="public"
                            defaultMessage='Public'
                        />
                    </span>
                    <Field
                        name="org_foundation_year"
                        showTime={false}
                        component={renderDateTimePicker}
                        placeholder={intl.formatMessage({
                          id: 'date.placeholder',
                          defaultMessage: 'YYYY'
                        })}
                    />
                </div>
                <div className="col-md-6 form-group">
                    <label htmlFor="org_type">
                        <FormattedMessage
                            id="org_type"
                            defaultMessage="Organisation type"
                        />
                    </label>
                    &nbsp;
                    <span className="badge badge-success">
                        <FormattedMessage
                            id="public"
                            defaultMessage='Public'
                        />
                    </span>
                    {OrgTypes ?
                        <Field
                            className="form-control custom-select"
                            name="org_type"
                            component="select"
                        >
                            { /*<option value={o.val}>
                            <FormattedMessage
                            id={o.name}
                            defaultMessage={o.name}
                            />
                        </option> */}
                            {OrgTypes.map((o) => (
                                <option value={o.val}>{o.name}</option>
                            ))
                            }

                        </Field> :
                        <p>Loading OrgTypes</p>
                    }
                </div>
            </div>
            { /* links start */}
            <FieldArray name="links" component={Links} />
            { /* links end */}

            { /* LinksSocial start */}
            <FieldArray name="org_web_social_channels" component={LinksSocial} />
            { /* LinksSocial end */}
            <div className="form-group">
                <label htmlFor="org_public_email">
                    <FormattedMessage
                        id="org_web_social_channels_for_project_likes_shares"
                        defaultMessage="Organisation web social channels for project likes shares"
                    />
                </label>
                <div className="input-group">
                    <Field
                        className="form-control"
                        name="org_web_social_channels_for_project_likes_shares"
                        component="input"
                        type="text"
                    />
                </div>
            </div>

            { /* LinksTel start */}
            <FieldArray name="org_phone" component={LinksTel} />
            { /* LinksTel end */}
            <div className="form-group">
                <label htmlFor="org_public_email">
                    <FormattedMessage
                        id="org_public_email"
                        defaultMessage="Organisation public email"
                    />
                </label>
                &nbsp;
                <span className="badge badge-success">
                    <FormattedMessage
                        id="public"
                        defaultMessage='Public'
                    />
                </span>
                <div className="input-group">
                    <Field
                        className="form-control"
                        name="org_public_email"
                        component="input"
                        type="text"
                        value={props.org_public_email}
                    />
                    <div className="input-group-addon">
                        <i className="fa fa-envelope"></i>
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="org_aims_and_activities">
                    <FormattedMessage
                        id="org_aims_and_activities"
                        defaultMessage="Aims and activities of the organisation"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_aims_and_activities"
                    component="textarea"
                    rows="4"
                    placeholder={props.intl.formatMessage({
                      id: 'about.placeholder',
                      defaultMessage: 'Tell me something about aims and activities of the organisation.'
                    })}
                    value={props.org_aims_and_activities}
                />
            </div>

            <div className="form-group">
                <label htmlFor="org_pic_code">
                    <FormattedMessage
                        id="org_pic_code"
                        defaultMessage="Organisation PIC Code"
                    />
                </label>
                &nbsp;
    <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_pic_code"
                    component="input"
                    type="text"
                    value={props.org_pic_code}
                />
            </div>

            <div className="form-group">
                {props.user && props.crew ?
                    <FieldArray
                        name="org_address"
                        component={AddressesOrganization}
                        props={{
                          countries: props.user._countries,
                          crewId: props.crew._id
                        }}
                    /> :
                    null
                }
            </div>

            <div className="row">
                <div className="col-md-9 form-group">
                    <label htmlFor="org_vat_number">
                        <FormattedMessage
                            id="org_vat_number"
                            defaultMessage="Organisation vat number"
                        />
                    </label>
                    &nbsp;
        <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_able_to_recuperate_vat"
                        component="input"
                        type="text"
                        value={props.org_vat_number}
                    />
                </div>

                <div className="col-md-3 form-group">
                    <label htmlFor="org_able_to_recuperate_vat">
                        <FormattedMessage
                            id="org_able_to_recuperate_vat"
                            defaultMessage="Able to recuperate VAT?"
                        />
                    </label>
                    <div>
                        <input type="radio" value="1" name="org_able_to_recuperate_vat" /> YES
        <input type="radio" value="0" name="org_able_to_recuperate_vat" /> NO
        </div>

                </div>
            </div>

            <div className="form-group">
                <label htmlFor="org_official_registration_number">
                    <FormattedMessage
                        id="org_official_registration_number"
                        defaultMessage="Organisation official registration number"
                    />
                </label>
                &nbsp;
    <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_official_registration_number"
                    component="input"
                    type="text"
                    value={props.org_official_registration_number}
                />
            </div>

            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="org_legal_representative_title">
                        <FormattedMessage
                            id="org_legal_representative_title"
                            defaultMessage="Organisation legal representative title"
                        />
                    </label>
                    &nbsp;
        <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control custom-select"
                        name="org_legal_representative_title"
                        component="select"
                    >
                        <option value="">
                            <FormattedMessage
                                id="Please select"
                                defaultMessage="Please select"
                            />
                        </option>
                        <option value="en">
                            <FormattedMessage
                                id="crew.edit.form.label.org_legal_representative_title.mr"
                                defaultMessage="Mr."
                            />
                        </option>
                        <option value="it">
                            <FormattedMessage
                                id="crew.edit.form.label.org_legal_representative_title.miss"
                                defaultMessage="Miss"
                            />
                        </option>
                    </Field>

                </div>
                <div className="col-md-6 form-group">
                    <label htmlFor="org_legal_representative_role">
                        <FormattedMessage
                            id="org_legal_representative_role"
                            defaultMessage="Organisation legal representative role"
                        />
                    </label>
                    &nbsp;
        <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_legal_representative_role"
                        component="input"
                        type="text"
                        value={props.org_legal_representative_role}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="org_legal_representative_name">
                        <FormattedMessage
                            id="org_legal_representative_name"
                            defaultMessage="Organisation legal representative name"
                        />
                    </label>
                    &nbsp;
        <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_legal_representative_name"
                        component="input"
                        type="text"
                        value={props.org_legal_representative_name}
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="org_legal_representative_surname">
                        <FormattedMessage
                            id="org_legal_representative_surname"
                            defaultMessage="Organisation legal representative surname"
                        />
                    </label>
                    &nbsp;
        <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_legal_representative_surname"
                        component="input"
                        type="text"
                        value={props.org_legal_representative_surname}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="org_legal_representative_email">
                    <FormattedMessage
                        id="org_legal_representative_email"
                        defaultMessage="Organisation legal representative email"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <div className="input-group">
                    <Field
                        className="form-control"
                        name="org_legal_representative_email"
                        component="input"
                        type="text"
                        value={props.org_legal_representative_email}
                    />
                    <div className="input-group-addon">
                        <i className="fa fa-envelope"></i>
                    </div>
                </div>
            </div>


            <div className="form-group">
                <label htmlFor="org_statute">
                    <FormattedMessage
                        id="org_statute"
                        defaultMessage="Organisation statute (pdf only)"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                {crew && crew.org_statute ?
                    <div>
                        <img
                            className="img-thumbnail mb-3"
                            src={crew.org_statute.publicUrl}
                            alt={`Organisation statute of ${props.org_name}`}
                        />
                    </div> :
                    null
                }
                {/* BL FIXME add pdf upload <ImageDropzone
        imageUploadInProgress={(crew && crew.imageUploadInProgress)}
        onDrop={onImageDrop(props._id)}
    /> */}
            </div>

            <div className="form-group">
                <label htmlFor="org_members_cv">
                    <FormattedMessage
                        id="org_members_cv"
                        defaultMessage="Organisation members cv (pdf only)"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                {crew && crew.org_members_cv ?
                    <div>
                        <img
                            className="img-thumbnail mb-3"
                            src={crew.org_members_cv.publicUrl}
                            alt={`Organisation members cv of ${props.org_name}`}
                        />
                    </div> :
                    null
                }
                {/* BL FIXME add  upload
    <ImageDropzone
        imageUploadInProgress={(crew && crew.imageUploadInProgress)}
        onDrop={onImageDrop(props._id)}
        /> */ }
            </div>

            <div className="form-group">
                <label htmlFor="org_activity_report">
                    <FormattedMessage
                        id="org_activity_report"
                        defaultMessage="Organisation Activity Report (pdf only)"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                {crew && crew.org_activity_report ?
                    <div>
                        <img
                            className="img-thumbnail mb-3"
                            src={crew.org_activity_report.publicUrl}
                            alt={`Activity Report of ${props.org_name}`}
                        />
                    </div> :
                    null
                }
                {/* BL FIXME add  upload
    <ImageDropzone
        imageUploadInProgress={(crew && crew.imageUploadInProgress)}
        onDrop={onImageDrop(props._id)}
    /> */ }
            </div>

            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="org_permanent_employees">
                        <FormattedMessage
                            id="org_permanent_employees"
                            defaultMessage="Organisation permanent employees"
                        />
                    </label>
                    &nbsp;
                    <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_permanent_employees"
                        component="input"
                        type="text"
                        value={props.org_permanent_employees}
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="org_permanent_employees_avnode">
                        <FormattedMessage
                            id="org_permanent_employees_avnode"
                            defaultMessage="Organisation permanent employees AVnode"
                        />
                    </label>
                    &nbsp;
                    <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_permanent_employees_avnode"
                        component="input"
                        type="text"
                        value={props.org_permanent_employees_avnode}
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 form-group">
                    <label htmlFor="org_temporary_employees">
                        <FormattedMessage
                            id="org_temporary_employees"
                            defaultMessage="Organisation temporary employees"
                        />
                    </label>
                    &nbsp;
                    <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_temporary_employees"
                        component="input"
                        type="text"
                        value={props.org_temporary_employees}
                    />
                </div>

                <div className="col-md-6 form-group">
                    <label htmlFor="org_temporary_employees_avnode">
                        <FormattedMessage
                            id="org_temporary_employees_avnode"
                            defaultMessage="Organisation temporary employees AVnode"
                        />
                    </label>
                    &nbsp;
                    <span className="badge badge-danger">
                        <FormattedMessage
                            id="private"
                            defaultMessage='Private'
                        />
                    </span>
                    <Field
                        className="form-control"
                        name="org_temporary_employees_avnode"
                        component="input"
                        type="text"
                        value={props.org_temporary_employees_avnode}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="org_relevance_in_the_project">
                    <FormattedMessage
                        id="org_relevance_in_the_project"
                        defaultMessage="Organisation relevance in the project"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_relevance_in_the_project"
                    component="textarea"
                    rows="4"
                    placeholder={props.intl.formatMessage({
                      id: 'about.placeholder',
                      defaultMessage: 'Tell me something about organisation relevance in the project.'
                    })}
                    value={props.org_relevance_in_the_project}
                />
            </div>

            <div className="form-group">
                <label htmlFor="org_emerging_artists_definition">
                    <FormattedMessage
                        id="org_emerging_artists_definition"
                        defaultMessage="Organisation emerging artists definition"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_emerging_artists_definition"
                    component="textarea"
                    rows="4"
                    placeholder={props.intl.formatMessage({
                      id: 'about.placeholder',
                      defaultMessage: 'Tell me the organisation emerging artists definition.'
                    })}
                    value={props.org_emerging_artists_definition}
                />
            </div>

            <div className="form-group">
                <label htmlFor="org_eu_grants_received_in_the_last_3_years">
                    <FormattedMessage
                        id="org_eu_grants_received_in_the_last_3_years"
                        defaultMessage="EU grants received in the last 3 years"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_eu_grants_received_in_the_last_3_years"
                    component="textarea"
                    rows="4"
                    placeholder={props.intl.formatMessage({
                      id: 'about.placeholder',
                      defaultMessage: 'EU grants received in the last 3 years.'
                    })}
                    value={props.org_eu_grants_received_in_the_last_3_years}
                />
            </div>

            <div className="form-group">
                <label htmlFor="org_annual_turnover_in_euro">
                    <FormattedMessage
                        id="org_annual_turnover_in_euro"
                        defaultMessage="Organisation annual turnover in euro"
                    />
                </label>
                &nbsp;
                <span className="badge badge-danger">
                    <FormattedMessage
                        id="private"
                        defaultMessage='Private'
                    />
                </span>
                <Field
                    className="form-control"
                    name="org_annual_turnover_in_euro"
                    component="input"
                    type="text"
                    value={props.org_annual_turnover_in_euro}
                />
            </div>

            <fieldset className="form-group">
                <legend>
                    <FormattedMessage
                        id="org_contacts"
                        defaultMessage="Organisation contacts (multiple)"
                    />
                </legend>
                {
                    crew && crew.contacts && crew.contacts.map((a) => (
                        <OrgContact contact={a} />
                    ))
                }
                <OrgContact contact={{}} />
            </fieldset>

            <fieldset className="form-group">
                <legend></legend>
                <legend>
                    <FormattedMessage
                        id="org_activities"
                        defaultMessage="Organisation activities (multiple)"
                    />
                </legend>
                {
                    crew && crew.activities && crew.activities.map((a) => (
                        <OrgActivity
                            contact={a}
                            intl={intl}
                        />
                    ))
                }
                {/*<OrgActivity 
                    contact={{}}
                    intl={intl}
                />*/}
            </fieldset>

            <div className="form-group">
                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    <FormattedMessage
                        id="form.save"
                        defaultMessage="Save"
                    />
                </button>
            </div>
        </form>
    </Layout>
</div>
  );
};

CrewOrganizationForm = injectIntl(reduxForm({
  form: 'crewOrganization',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(CrewOrganizationForm));

const CrewOrganization = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
  };
  return (
    <CrewOrganizationForm
    initialValues={props.crew}
    onSubmit={onSubmit}
    onSubmitSuccess={onSubmitSuccess}
    {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  editCrew: dispatch(editCrew),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewOrganization);

