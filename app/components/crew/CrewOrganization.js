import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Languages from '../language/Languages';

import Place from '../place/PlaceContainer';

import OrgContact from './OrgContact';
import OrgActivity from './OrgActivity';

import WebLinkTypes from '../link/WebLinkTypes';
import LinkWeb from '../link/LinkWeb';
import LinkSocial from '../link/LinkSocial';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';
import {
    editCrew//,    crewLinkDelete,    crewLinkEdit
} from '../../reducers/actions';

let CrewOrganizationForm = props => {
    const { handleSubmit, editCrew, crew, intl } = props;

    /* const onLinkEdit = (link) => (e) => {
        e.preventDefault();
        return crewLinkEdit(props._id, link._id);
    };
    const onLinkDelete = (link) => (e) => {
        e.preventDefault();
        return crewLinkDelete(props._id, link._id);
    }; */

    if (!props.org) props.org = {};

    return (
        <div>
            <div className="container-fluid">
                <Match>
                    {({ url }) => <CrewNav url={url} crew={props.crew} />}
                </Match>
            </div>
            <Layout>
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
            <span class="badge badge-danger">
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
                            value={props.org_name}
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
              <span class="badge badge-success">
                                <FormattedMessage
                                    id="public"
                                    defaultMessage='Public'
                                />
                            </span>
                            <Field
                                className="form-control"
                                name="org_foundation_year"
                                component="input"
                                type="text"
                                value={props.org_foundation_year}
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
              <span class="badge badge-success">
                                <FormattedMessage
                                    id="public"
                                    defaultMessage='Public'
                                />
                            </span>
                            <Field
                                className="form-control custom-select"
                                name="org_type"
                                component="select"
                            >
                                <option value="">
                                    <FormattedMessage
                                        id="Please select"
                                        defaultMessage="Please select"
                                    />
                                </option>
                                <option value="art_gallery">
                                    <FormattedMessage
                                        id="art_gallery"
                                        defaultMessage="Art gallery"
                                    />
                                </option>
                                <option value="centre_for_architecture">
                                    <FormattedMessage
                                        id="centre_for_architecture"
                                        defaultMessage="Centre for Architecture"
                                    />
                                </option>
                                <option value="choir">
                                    <FormattedMessage
                                        id="choir"
                                        defaultMessage="Choir"
                                    />
                                </option>
                                <option value="concert_hall">
                                    <FormattedMessage
                                        id="concert_hall"
                                        defaultMessage="Concert hall"
                                    />
                                </option>
                                <option value="dance_company">
                                    <FormattedMessage
                                        id="dance_company"
                                        defaultMessage="Dance Company"
                                    />
                                </option>
                                <option value="design-art_centre">
                                    <FormattedMessage
                                        id="design-art_centre"
                                        defaultMessage="Design/Art centre"
                                    />
                                </option>
                                <option value="festival">
                                    <FormattedMessage
                                        id="festival"
                                        defaultMessage="Festival (non Audiovisual)"
                                    />
                                </option>
                                <option value="group_of_young_people_active_in_youth_work">
                                    <FormattedMessage
                                        id="group_of_young_people_active_in_youth_work"
                                        defaultMessage="Group of young people active in youth work"
                                    />
                                </option>
                                <option value="higher_education_institution">
                                    <FormattedMessage
                                        id="higher_education_institution"
                                        defaultMessage="Higher education institution (tertiary level)"
                                    />
                                </option>
                                <option value="library">
                                    <FormattedMessage
                                        id="library"
                                        defaultMessage="Library"
                                    />
                                </option>
                                <option value="literature_foundation">
                                    <FormattedMessage
                                        id="literature_foundation"
                                        defaultMessage="Literature Foundation"
                                    />
                                </option>
                                <option value="local_public_body">
                                    <FormattedMessage
                                        id="local_public_body"
                                        defaultMessage="Local Public body"
                                    />
                                </option>
                                <option value="multimedia_association">
                                    <FormattedMessage
                                        id="multimedia_association"
                                        defaultMessage="Multimedia association"
                                    />
                                </option>
                                <option value="museum">
                                    <FormattedMessage
                                        id="museum"
                                        defaultMessage="Museum"
                                    />
                                </option>
                                <option value="music_centre">
                                    <FormattedMessage
                                        id="music_centre"
                                        defaultMessage="Music Centre"
                                    />
                                </option>
                                <option value="national_public_body">
                                    <FormattedMessage
                                        id="national_public_body"
                                        defaultMessage="National Public body"
                                    />
                                </option>
                                <option value="non-governmental_organisation-association-social_enterprise">
                                    <FormattedMessage
                                        id="non-governmental_organisation-association-social_enterprise"
                                        defaultMessage="Non-governmental organisation/association/social enterprise"
                                    />
                                </option>
                                <option value="opera">
                                    <FormattedMessage
                                        id="opera"
                                        defaultMessage="Opera"
                                    />
                                </option>
                                <option value="orchestra">
                                    <FormattedMessage
                                        id="orchestra"
                                        defaultMessage="Orchestra"
                                    />
                                </option>
                                <option value="regional_public_body">
                                    <FormattedMessage
                                        id="regional_public_body"
                                        defaultMessage="Regional Public body"
                                    />
                                </option>
                                <option value="research_institute-centre">
                                    <FormattedMessage
                                        id="research_institute-centre"
                                        defaultMessage="Research Institute/Centre"
                                    />
                                </option>
                                <option value="school-institute-educational_centre-general_education">
                                    <FormattedMessage
                                        id="school-institute-educational_centre-general_education"
                                        defaultMessage="School/Institute/Educational centre – General education (secondary level)"
                                    />
                                </option>
                                <option value="street_art_association">
                                    <FormattedMessage
                                        id="street_art_association"
                                        defaultMessage="Street art association"
                                    />
                                </option>
                                <option value="theatre">
                                    <FormattedMessage
                                        id="theatre"
                                        defaultMessage="Theatre"
                                    />
                                </option>
                                <option value="other">
                                    <FormattedMessage
                                        id="other"
                                        defaultMessage="Other"
                                    />
                                </option>
                            </Field>
                        </div>
                    </div>

                    <fieldset className="form-group">
                        <legend>
                            <FormattedMessage
                                id="websites"
                                defaultMessage="Websites"
                            />
                        </legend>
                        <label htmlFor="linkWeb">
                            <FormattedMessage
                                id="websiteUrl"
                                defaultMessage="Website Url"
                            />
                        </label>
                        <div className="input-group">
                            <Field
                                className="form-control"
                                name="linkWeb"
                                component="input"
                                placeholder={intl.formatMessage({
                                    id: 'addUrl',
                                    defaultMessage: 'Add/edit url'
                                })}
                                value={props.linkWeb}
                            />
                        </div>
                        <label>
                            <FormattedMessage
                                id="manageLinksWeb"
                                defaultMessage="Manage your Web Links"
                            />
                        </label>
                        <ul className="list-group mt-2">
                            {
                                props && props.links && props.links.map((l) => (
                                    l.type === 'web' ?
                                        <LinkWeb
                                            linkWeb={l}
                                            //onMakePrimary={onLinkWebMakePrimary(l)}
                                            //onEdit={onLinkEdit(l)}
                                            //onDelete={linkDelete(l)}
                                            intl={intl}
                                        />
                                        :
                                        null
                                ))
                            }
                        </ul>
                    </fieldset>

                    <fieldset className="form-group">
                        <legend>
                            <FormattedMessage
                                id="socials"
                                defaultMessage="Social channels"
                            />
                        </legend>
                        <div className="row">
                            <div className="col-md-9 form-group">
                                <label htmlFor="linkSocial">
                                    <FormattedMessage
                                        id="url"
                                        defaultMessage="Url"
                                    />
                                </label>
                                <div className="input-group">
                                    <Field
                                        className="form-control"
                                        name="linkSocial"
                                        component="input"
                                        placeholder={intl.formatMessage({
                                            id: 'addUrl',
                                            defaultMessage: 'Add/edit url'
                                        })}
                                        value={props.linkSocial}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 form-group">
                                <label htmlFor="linkType">
                                    <FormattedMessage
                                        id="linkType"
                                        defaultMessage="Link type"
                                    />
                                </label>
                                {WebLinkTypes ?
                                    <Field
                                        className="form-control custom-select"
                                        name="linkType"
                                        component="select"
                                        value={props.linkType}
                                    >
                                        <option value="ot">
                                            <FormattedMessage
                                                id="Please select"
                                                defaultMessage="Please select"
                                            />
                                        </option>
                                        {WebLinkTypes.map((c) => (
                                            <option value={c.key.toLowerCase()}>{c.name}</option>
                                        ))
                                        }
                                        { /*  */}
                                    </Field> :
                                    <p>Loading a link types…</p>
                                }
                            </div>
                        </div>
                        <label>
                            <FormattedMessage
                                id="manageLinksSocial"
                                defaultMessage="Manage your Social Links"
                            />
                        </label>
                        <ul className="list-group mt-2">
                            {
                                props && props.links && props.links.map((l) => (
                                    l.type === 'tw' || l.type === 'fb' || l.type === 'ot' ?
                                        <LinkSocial
                                            linkSocial={l}
                                            //onMakePrimary={onLinkSocialMakePrimary(l)}
                                            //onEdit={onLinkEdit(l)}
                                            //onDelete={onLinkDelete(l)}
                                            intl={intl}
                                        />
                                        :
                                        null
                                ))
                            }
                        </ul>
                    </fieldset>
                    <div className="form-group">
                        <label htmlFor="org_public_email">
                            <FormattedMessage
                                id="org_public_email"
                                defaultMessage="Organisation public email"
                            />
                        </label>
                        &nbsp;
            <span class="badge badge-success">
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
                            <div className="input-group-addon">
                                <i className="fa fa-minus"></i>
                            </div>
                            <div className="input-group-addon">
                                <i className="fa fa-plus"></i>
                            </div>
                        </div>
                    </div>

                        {/* BL TODO <LinksPhoneEdit links={props.org_links} privacy="public" />*/}

                    <div className="form-group">
                        <label htmlFor="org_aims_and_activities">
                            <FormattedMessage
                                id="org_aims_and_activities"
                                defaultMessage="Aims and activities of the organisation"
                            />
                        </label>
                        &nbsp;
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
                        <label htmlFor="org_address">
                            <FormattedMessage
                                id="org_address"
                                defaultMessage="Organisation legal address (only one)"
                            />
                        </label>
                        &nbsp;
            <span class="badge badge-danger">
                            <FormattedMessage
                                id="private"
                                defaultMessage='Private'
                            />
                        </span>
                        <Place user={crew} />
                        <ul className="list-group mt-2">
                            {
                                crew && crew.org_address && crew.org_address.map((a) => (
                                    <Address address={a} />
                                ))
                            }
                        </ul>
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
              <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
                            <div className="input-group-addon">
                                <i className="fa fa-minus"></i>
                            </div>
                            <div className="input-group-addon">
                                <i className="fa fa-plus"></i>
                            </div>
                        </div>
                    </div>

                    {/* BL TODO <LinksMobileEdit links={props.org_legal_representative_links} privacy="private" />

                    <LinksSkypeEdit links={props.org_legal_representative_links} privacy="private" />

                        <LinksSocialEdit links={props.org_legal_representative_links} privacy="public" />*/}

                    <div className="form-group">
                        <label htmlFor="org_statute">
                            <FormattedMessage
                                id="org_statute"
                                defaultMessage="Organisation statute (pdf only)"
                            />
                        </label>
                        &nbsp;
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
              <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
            <span class="badge badge-danger">
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
                                <OrgActivity contact={a} />
                            ))
                        }
                        <OrgActivity contact={{}} />
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

CrewOrganizationForm = injectIntl(reduxForm({ form: 'crewOrganization' })(CrewOrganizationForm));

const CrewOrganization = props => {
    const onSubmit = (props, dispatch) => {
        //dispatch(editCrew(props));
        //editCrew(dispatch);
    };
    const onSubmitSuccess = () => {
        //route('/account/crews');
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
    console.log('_______________ props __________________________________');
    console.log('--> CrewPublic props.url: ' + JSON.stringify(props.url));
    console.log('_______________ state __________________________________');
    console.log('--> CrewPublic state.user.crewId: ' + JSON.stringify(state.user.crewId));
    return {
        crew: (state.user.crews.find(c => { return c._id === props._id; })),
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => ({
    //linkDelete: dispatch(crewLinkDelete),
    editCrew: dispatch(editCrew)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewOrganization);

