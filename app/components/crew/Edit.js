import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import ImageDropzone from '../ImageDropzone';
import About from '../about/About';
import Languages from '../language/Languages';

import {
  editCrew,
  suggestCrewMember,
  addCrewMember,
  addCrewImage,
  addCrewTeaserImage,
  removeCrewMember,
} from '../../reducers/actions';

const Member = injectIntl(({ member, me, onDelete, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'crew.edit.form.member.met',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${member.stagename} `}
        {(member._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      {member.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

let CrewForm = props => {
  const { handleSubmit, dispatch, crew, user } = props;
  const memberSuggestions = props.user._memberSuggestions || [];
  const findMember = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestCrewMember(crew._id, e.target.value));
    } // FIXME: handle reset
  };
  const addMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(addCrewMember(crewId, member));
  };

  const removeMember = (crewId) => (member) => (e) => {
    e.preventDefault();
    return dispatch(removeCrewMember(crewId, member));
  };

  const onImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewImage(crewId, file));
  };

  const onTeaserImageDrop = (crewId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addCrewTeaserImage(crewId, file));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Field
          name="_id"
          component="input"
          type="hidden"
        />

        <div className="form-group">
          <label htmlFor="name">
            <FormattedMessage
              id="crew.edit.form.label.name"
              defaultMessage="Name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="crew.edit.form.label.teaserimage"
              defaultMessage="TeaserImage"
            />
          </label>
          {crew && crew.teaserImage ?
            <img
              className="img-thumbnail mb-3"
              src={crew.teaserImage.publicUrl}
              alt={`teaser image of ${crew.name}`}
            /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onTeaserImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            <FormattedMessage
              id="crew.edit.form.label.image"
              defaultMessage="Image"
            />
          </label>
          {crew && crew.image ?
            <img
              className="img-thumbnail mb-3"
              src={crew.image.publicUrl}
              alt={`image of ${crew.name}`}
            /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="row">
          <div className="col-md-9 form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="crew.edit.form.label.addabout"
                defaultMessage="About"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="about"
                component="textarea"
                rows="4"
                placeholder="About the crew"
                value={props.about}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <label htmlFor="aboutlanguage">
              <FormattedMessage
                id="crew.edit.form.label.aboutlanguage"
                defaultMessage="Language"
              />
            </label>
            {Languages ?
              <Field
                className="form-control custom-select"
                name="aboutlanguage"
                component="select"
                value={props.aboutlanguage}
              >
                <option value="en">
                  <FormattedMessage
                    id="crew.edit.form.label.aboutlanguage.empty"
                    defaultMessage="English"
                  />
                </option>
                {Languages.map((c) => (
                  <option value={c.code}>{c.language}</option>
                ))
                }
                { /*  */}
              </Field> :
              <p>Loading languages…</p>
            }
          </div>
        </div>

        <label>
          <FormattedMessage
            id="crew.edit.form.label.about"
            defaultMessage="Manage your About texts"
          />
        </label>
        <ul className="list-group mt-2">
          {
            crew && crew.abouts && crew.abouts.map((a) => (
              <About about={a} />
            ))
          }
        </ul>

        <div className="form-group">
          <label htmlFor="members">
            <FormattedMessage
              id="crew.edit.form.label.members"
              defaultMessage="Members"
            />
          </label>
          <ul className="list-group">
            {crew && crew.members && crew.members.map((m) => (
              <Member
                member={m}
                me={props.user._id}
                onDelete={removeMember(crew._id)(m)}
              />
            ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="member">
            <FormattedMessage
              id="crew.edit.form.label.suggestMembers"
              defaultMessage="Invite others"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'crew.edit.form.label.suggestMembers',
              defaultMessage: 'Type to find users…'
            })}
            onKeyUp={findMember}
          />
          <div className="mt-1 list-group">
            {user && user._memberSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="crew.edit.form.label.suggestMembersLoading"
                  defaultMessage="Finding users…"
                />
              </div> :
              null
            }
            {memberSuggestions.map((m) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addMember(props._id)(m)}
              >
                {m.stagename} ({m.name})
                </button>
            ))
            }
          </div>
        </div>
        <h3>
            <FormattedMessage
              id="crew.edit.form.label.org_extradata_title"
              defaultMessage="Organization Extra Data"
            />
        </h3>
        <div className="form-group">
          <label htmlFor="org_name">
            <FormattedMessage
              id="crew.edit.form.label.org_name"
              defaultMessage="Organisation name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_pic_code">
            <FormattedMessage
              id="crew.edit.form.label.org_pic_code"
              defaultMessage="Organisation PIC Code"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_pic_code}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_type">
            <FormattedMessage
              id="crew.edit.form.label.org_type"
              defaultMessage="Organisation type"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_type}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_logo">
            <FormattedMessage
              id="crew.edit.form.label.org_logo"
              defaultMessage="Organisation logo"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_logo}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_website">
            <FormattedMessage
              id="crew.edit.form.label.org_website"
              defaultMessage="Organisation url"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_website}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_web_social_channels">
            <FormattedMessage
              id="crew.edit.form.label.org_web_social_channels"
              defaultMessage="Organisation Web & Social Channels"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_web_social_channels}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_web_social_channels_for_project_likes_shares">
            <FormattedMessage
              id="crew.edit.form.label.org_web_social_channels_for_project_likes_shares"
              defaultMessage="Organisation Web & Social Channels for LIKES & SHARES"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_web_social_channels_for_project_likes_shares}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_public_email">
            <FormattedMessage
              id="crew.edit.form.label.org_public_email"
              defaultMessage="Organisation public email"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_public_email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_phone">
            <FormattedMessage
              id="crew.edit.form.label.org_phone"
              defaultMessage="Organisation phone"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_phone}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_aims_and_activities">
            <FormattedMessage
              id="crew.edit.form.label.org_aims_and_activities"
              defaultMessage="Aims and activities of the organisation"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_aims_and_activities}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_foundation_year">
            <FormattedMessage
              id="crew.edit.form.label.org_foundation_year"
              defaultMessage="Organisation foundation year"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_foundation_year}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_address">
            <FormattedMessage
              id="crew.edit.form.label.org_address"
              defaultMessage="Organisation address"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_address}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_post_code">
            <FormattedMessage
              id="crew.edit.form.label.org_post_code"
              defaultMessage="Organisation post code"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_post_code}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_city">
            <FormattedMessage
              id="crew.edit.form.label.org_city"
              defaultMessage="Organisation city"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_city}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_region">
            <FormattedMessage
              id="crew.edit.form.label.org_region"
              defaultMessage="Organisation region"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_region}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_country">
            <FormattedMessage
              id="crew.edit.form.label.org_country"
              defaultMessage="Organisation country"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_country}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_geolocation">
            <FormattedMessage
              id="crew.edit.form.label.org_geolocation"
              defaultMessage="Organisation geolocation"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_geolocation}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_vat_number">
            <FormattedMessage
              id="crew.edit.form.label.org_vat_number"
              defaultMessage="Organisation vat number"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_vat_number}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_able_to_recuperate_vat">
            <FormattedMessage
              id="crew.edit.form.label.org_able_to_recuperate_vat"
              defaultMessage="Able to recuperate VAT?"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_able_to_recuperate_vat}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_official_registration_number">
            <FormattedMessage
              id="crew.edit.form.label.org_official_registration_number"
              defaultMessage="Organisation official registration number"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_official_registration_number}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_title">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_title"
              defaultMessage="Organisation contact title"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_name">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_name"
              defaultMessage="Organisation contact name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_surname">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_surname"
              defaultMessage="Organisation contact surname"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_surname}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_role">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_role"
              defaultMessage="Organisation contact role"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_role}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_email">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_email"
              defaultMessage="Organisation contact email"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_language">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_language"
              defaultMessage="Organisation contact language"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_language}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_mobile_phone">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_mobile_phone"
              defaultMessage="Organisation contact mobile phone"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_mobile_phone}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_skype">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_skype"
              defaultMessage="Organisation contact skype"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_skype}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_contact_facebook">
            <FormattedMessage
              id="crew.edit.form.label.org_contact_facebook"
              defaultMessage="Organisation contact facebook"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_contact_facebook}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_title">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_title"
              defaultMessage="Organisation legal representative title"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_name">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_name"
              defaultMessage="Organisation legal representative name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_surname">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_surname"
              defaultMessage="Organisation legal representative surname"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_surname}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_role">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_role"
              defaultMessage="Organisation legal representative role"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_role}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_email">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_email"
              defaultMessage="Organisation legal representative email"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_email}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_mobile_phone">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_mobile_phone"
              defaultMessage="Organisation legal representative mobile phone"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_mobile_phone}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_skype">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_skype"
              defaultMessage="Organisation legal representative skype"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_skype}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_facebook">
            <FormattedMessage
              id="crew.edit.form.label.org_legal_representative_facebook"
              defaultMessage="Organisation legal representative facebook"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_legal_representative_facebook}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_statute">
            <FormattedMessage
              id="crew.edit.form.label.org_statute"
              defaultMessage="Organisation statute"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_statute}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_members_cv">
            <FormattedMessage
              id="crew.edit.form.label.org_members_cv"
              defaultMessage="Organisation members cv"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_members_cv}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_activity_report">
            <FormattedMessage
              id="crew.edit.form.label.org_activity_report"
              defaultMessage="Organisation Activity Report"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_activity_report}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_permanent_employers">
            <FormattedMessage
              id="crew.edit.form.label.org_permanent_employers"
              defaultMessage="Organisation permanent employers"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_permanent_employers}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_permanent_employers_avnode">
            <FormattedMessage
              id="crew.edit.form.label.org_permanent_employers_avnode"
              defaultMessage="Organisation permanent employers AVnode"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_permanent_employers_avnode}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_temporary_employers">
            <FormattedMessage
              id="crew.edit.form.label.org_temporary_employers"
              defaultMessage="Organisation temporary employers"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_temporary_employers}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_temporary_employers_avnode">
            <FormattedMessage
              id="crew.edit.form.label.org_temporary_employers_avnode"
              defaultMessage="Organisation temporary employers AVnode"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_temporary_employers_avnode}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_relevance_in_the_project">
            <FormattedMessage
              id="crew.edit.form.label.org_relevance_in_the_project"
              defaultMessage="Organisation relevance in the project"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_relevance_in_the_project}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_emerging_artists_definition">
            <FormattedMessage
              id="crew.edit.form.label.org_emerging_artists_definition"
              defaultMessage="Organisation emerging artists definition"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_emerging_artists_definition}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_eu_grants_received_in_the_last_3_years">
            <FormattedMessage
              id="crew.edit.form.label.org_eu_grants_received_in_the_last_3_years"
              defaultMessage="EU grants received in the last 3 years"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_eu_grants_received_in_the_last_3_years}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_annual_turnover_in_euro">
            <FormattedMessage
              id="crew.edit.form.label.org_annual_turnover_in_euro"
              defaultMessage="Annual turnover in euro"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.org_annual_turnover_in_euro}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_name">
            <FormattedMessage
              id="crew.edit.form.label.activity_name"
              defaultMessage="Activity Name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_start_date">
            <FormattedMessage
              id="crew.edit.form.label.activity_start_date"
              defaultMessage="Activity start date"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_start_date}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_end_date">
            <FormattedMessage
              id="crew.edit.form.label.activity_end_date"
              defaultMessage="Activity end date"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_end_date}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_month">
            <FormattedMessage
              id="crew.edit.form.label.activity_month"
              defaultMessage="Activity Month"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_month}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_city">
            <FormattedMessage
              id="crew.edit.form.label.activity_city"
              defaultMessage="Activity City"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_city}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_country">
            <FormattedMessage
              id="crew.edit.form.label.activity_country"
              defaultMessage="Activity Country"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_country}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_website">
            <FormattedMessage
              id="crew.edit.form.label.activity_website"
              defaultMessage="Activity Website"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_website}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_facebook">
            <FormattedMessage
              id="crew.edit.form.label.activity_facebook"
              defaultMessage="Activity Facebook"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_facebook}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_instagram">
            <FormattedMessage
              id="crew.edit.form.label.activity_instagram"
              defaultMessage="Activity Instagram"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_instagram}
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_other_profiles">
            <FormattedMessage
              id="crew.edit.form.label.activity_other_profiles"
              defaultMessage="Activity Other profiles"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="name"
            component="input"
            type="text"
            value={props.activity_other_profiles}
          />
        </div>



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
  );
};

CrewForm = injectIntl(reduxForm({ form: 'crew' })(CrewForm));

const EditCrew = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editCrew(props));
  };
  const onSubmitSuccess = () => {
    route('/account/crews');
  };
  return (
    <CrewForm
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
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditCrew);
