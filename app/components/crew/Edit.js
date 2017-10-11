import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import ImageDropzone from '../ImageDropzone';
import About from '../about/About';
import Languages from '../language/Languages';

import Place from '../place/PlaceContainer';

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
        {`${member.stagename}`}
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
              id="name"
              defaultMessage={'Name {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
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
              defaultMessage={'TeaserImage {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
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
              defaultMessage={'Image {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
          </label>
          {crew && crew.image && crew.image.publicUrl ?
            <div><img
              className="img-thumbnail mb-3"
              src={crew.image.publicUrl}
              alt={`image of ${crew.name}`}
            /></div> :
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
                id="addabout"
                defaultMessage={'About {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
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
                id="language"
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
                    id="language.en"
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
            id="manageabout"
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
              defaultMessage={'Members {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
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
                defaultMessage={'Organisation legal name {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                  id="crew.edit.form.label.org_foundation_year"
                  defaultMessage={'Organisation foundation year {visibility}'}
                  values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
              />
            </label>
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
                  id="crew.edit.form.label.org_type"
                  defaultMessage={'Organisation type {visibility}'}
                  values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
              />
            </label>
            <Field
                className="form-control custom-select"
                name="org_type"
                component="select"
            >
              <option value="">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.empty"
                    defaultMessage="Please select"
                />
              </option>
              <option value="art_gallery">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.art_gallery"
                    defaultMessage="Art gallery"
                />
              </option>
              <option value="centre_for_architecture">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.centre_for_architecture"
                    defaultMessage="Centre for Architecture"
                />
              </option>
              <option value="choir">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.choir"
                    defaultMessage="Choir"
                />
              </option>
              <option value="concert_hall">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.concert_hall"
                    defaultMessage="Concert hall"
                />
              </option>
              <option value="dance_company">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.dance_company"
                    defaultMessage="Dance Company"
                />
              </option>
              <option value="design-art_centre">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.design-art_centre"
                    defaultMessage="Design/Art centre"
                />
              </option>
              <option value="festival">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.festival"
                    defaultMessage="Festival (non Audiovisual)"
                />
              </option>
              <option value="group_of_young_people_active_in_youth_work">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.group_of_young_people_active_in_youth_work"
                    defaultMessage="Group of young people active in youth work"
                />
              </option>
              <option value="higher_education_institution">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.higher_education_institution"
                    defaultMessage="Higher education institution (tertiary level)"
                />
              </option>
              <option value="library">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.library"
                    defaultMessage="Library"
                />
              </option>
              <option value="literature_foundation">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.literature_foundation"
                    defaultMessage="Literature Foundation"
                />
              </option>
              <option value="local_public_body">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.local_public_body"
                    defaultMessage="Local Public body"
                />
              </option>
              <option value="multimedia_association">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.multimedia_association"
                    defaultMessage="Multimedia association"
                />
              </option>
              <option value="museum">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.museum"
                    defaultMessage="Museum"
                />
              </option>
              <option value="music_centre">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.music_centre"
                    defaultMessage="Music Centre"
                />
              </option>
              <option value="national_public_body">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.national_public_body"
                    defaultMessage="National Public body"
                />
              </option>
              <option value="non-governmental_organisation-association-social_enterprise">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.non-governmental_organisation-association-social_enterprise"
                    defaultMessage="Non-governmental organisation/association/social enterprise"
                />
              </option>
              <option value="opera">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.opera"
                    defaultMessage="Opera"
                />
              </option>
              <option value="orchestra">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.orchestra"
                    defaultMessage="Orchestra"
                />
              </option>
              <option value="regional_public_body">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.regional_public_body"
                    defaultMessage="Regional Public body"
                />
              </option>
              <option value="research_institute-centre">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.research_institute-centre"
                    defaultMessage="Research Institute/Centre"
                />
              </option>
              <option value="school-institute-educational_centre-general_education">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.school-institute-educational_centre-general_education"
                    defaultMessage="School/Institute/Educational centre – General education (secondary level)"
                />
              </option>
              <option value="street_art_association">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.street_art_association"
                    defaultMessage="Street art association"
                />
              </option>
              <option value="theatre">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.theatre"
                    defaultMessage="Theatre"
                />
              </option>
              <option value="other">
                <FormattedMessage
                    id="crew.edit.form.label.org_type.other"
                    defaultMessage="Other"
                />
              </option>
            </Field>
          </div>
        </div>


        <div className="form-group">
          <label htmlFor="org_logo">
            <FormattedMessage
              id="crew.edit.form.label.org_logo"
              defaultMessage={'Organisation logo (.svg only) {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          {crew && crew.org_logo ?
            <div>
              <img
                  className="img-thumbnail mb-3"
                  src={crew.org_logo.publicUrl}
                  alt={`Logo of ${props.org_name}`}
              />
            </div> :
            null
          }
          <ImageDropzone
              imageUploadInProgress={(crew && crew.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_website">
            <FormattedMessage
                id="crew.edit.form.label.org_website"
                defaultMessage={'Organisation website {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_website"
              component="input"
              type="text"
              value={props.org_website}
            />
            <div className="input-group-addon">
              <i className="fa fa-link"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_web_social_channels">
            <FormattedMessage
                id="crew.edit.form.label.org_web_social_channels"
                defaultMessage={'Organisation Web & Social Channels {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_web_social_channels"
              component="input"
              type="text"
              value={props.org_web_social_channels}
            />
            <div className="input-group-addon">
              <i className="fa fa-link"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_web_social_channels_for_project_likes_shares">
            <FormattedMessage
                id="crew.edit.form.label.org_web_social_channels_for_project_likes_shares"
                defaultMessage={'Organisation Web & Social Channels for LIKES & SHARES {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_web_social_channels_for_project_likes_shares"
              component="input"
              type="text"
                value={props.org_web_social_channels_for_project_likes_shares}
            />
            <div className="input-group-addon">
              <i className="fa fa-link"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_public_email">
            <FormattedMessage
                id="crew.edit.form.label.org_public_email"
                defaultMessage={'Organisation public email {visibility}'}
              values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
          </label>
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

        <div className="form-group">
          <label htmlFor="org_phone">
            <FormattedMessage
                id="crew.edit.form.label.org_phone"
                defaultMessage={'Organisation phone {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_phone"
              component="input"
              type="text"
              value={props.org_phone}
            />
            <div className="input-group-addon">
              <i className="fa fa-phone"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_aims_and_activities">
            <FormattedMessage
                id="crew.edit.form.label.org_aims_and_activities"
                defaultMessage={'Aims and activities of the organisation {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                id="crew.edit.form.label.org_pic_code"
                defaultMessage={'Organisation PIC Code {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
              id="crew.edit.form.label.org_address"
              defaultMessage={'Organisation legal address (only one) {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                  id="crew.edit.form.label.org_vat_number"
                  defaultMessage={'Organisation vat number {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
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
                  id="crew.edit.form.label.org_able_to_recuperate_vat"
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
                id="crew.edit.form.label.org_official_registration_number"
                defaultMessage={'Organisation official registration number {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                  id="crew.edit.form.label.org_legal_representative_title"
                  defaultMessage={'Organisation legal representative title {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
            <Field
              className="form-control custom-select"
              name="org_legal_representative_title"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.org_legal_representative_title.empty"
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
                  id="crew.edit.form.label.org_legal_representative_role"
                  defaultMessage={'Organisation legal representative role {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
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
                  id="crew.edit.form.label.org_legal_representative_name"
                  defaultMessage={'Organisation legal representative name {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
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
                  id="crew.edit.form.label.org_legal_representative_surname"
                  defaultMessage={'Organisation legal representative surname {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
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
                id="crew.edit.form.label.org_legal_representative_email"
                defaultMessage={'Organisation legal representative email {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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

        <div className="form-group">
          <label htmlFor="org_legal_representative_mobile_phone">
            <FormattedMessage
                id="crew.edit.form.label.org_legal_representative_mobile_phone"
                defaultMessage={'Organisation legal representative mobile phone {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_legal_representative_mobile_phone"
              component="input"
              type="text"
              value={props.org_legal_representative_mobile_phone}
            />
            <div className="input-group-addon">
              <i className="fa fa-phone"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_skype">
            <FormattedMessage
                id="crew.edit.form.label.org_legal_representative_skype"
                defaultMessage={'Organisation legal representative skype {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_legal_representative_skype"
              component="input"
              type="text"
              value={props.org_legal_representative_skype}
            />
            <div className="input-group-addon">
              <i className="fa fa-phone"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_legal_representative_facebook">
            <FormattedMessage
                id="crew.edit.form.label.org_legal_representative_facebook"
                defaultMessage={'Organisation legal representative facebook {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="org_legal_representative_facebook"
              component="input"
              type="text"
              value={props.org_legal_representative_facebook}
            />
            <div className="input-group-addon">
              <i className="fa fa-link"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-minus"></i>
            </div>
            <div className="input-group-addon">
              <i className="fa fa-plus"></i>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="org_statute">
            <FormattedMessage
                id="crew.edit.form.label.org_statute"
                defaultMessage={'Organisation statute (pdf only) {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_members_cv">
            <FormattedMessage
                id="crew.edit.form.label.org_members_cv"
                defaultMessage={'Organisation members cv (pdf only) {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="org_activity_report">
            <FormattedMessage
                id="crew.edit.form.label.org_activity_report"
                defaultMessage={'Organisation Activity Report (pdf only) {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
          <ImageDropzone
            imageUploadInProgress={(crew && crew.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="org_permanent_employers">
              <FormattedMessage
                  id="crew.edit.form.label.org_permanent_employers"
                  defaultMessage={'Organisation permanent employers {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
            <Field
                className="form-control"
                name="org_permanent_employers"
                component="input"
                type="text"
                value={props.org_permanent_employers}
            />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="org_permanent_employers_avnode">
              <FormattedMessage
                  id="crew.edit.form.label.org_permanent_employers_avnode"
                  defaultMessage={'Organisation permanent employers AVnode {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
            <Field
                className="form-control"
                name="org_permanent_employers_avnode"
                component="input"
                type="text"
                value={props.org_permanent_employers_avnode}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 form-group">
            <label htmlFor="org_temporary_employers">
              <FormattedMessage
                  id="crew.edit.form.label.org_temporary_employers"
                  defaultMessage={'Organisation temporary employers {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
            <Field
                className="form-control"
                name="org_temporary_employers"
                component="input"
                type="text"
                value={props.org_temporary_employers}
            />
          </div>

          <div className="col-md-6 form-group">
            <label htmlFor="org_temporary_employers_avnode">
              <FormattedMessage
                  id="crew.edit.form.label.org_temporary_employers_avnode"
                  defaultMessage={'Organisation temporary employers AVnode {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
            </label>
            <Field
                className="form-control"
                name="org_temporary_employers_avnode"
                component="input"
                type="text"
                value={props.org_temporary_employers_avnode}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="org_relevance_in_the_project">
            <FormattedMessage
                id="crew.edit.form.label.org_relevance_in_the_project"
                defaultMessage={'Organisation relevance in the project {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                id="crew.edit.form.label.org_emerging_artists_definition"
                defaultMessage={'Organisation emerging artists definition {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
                id="crew.edit.form.label.org_eu_grants_received_in_the_last_3_years"
                defaultMessage={'EU grants received in the last 3 years {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
              id="crew.edit.form.label.org_annual_turnover_in_euro"
              defaultMessage={'Organisation annual turnover in euro {visibility}'}
              values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
          </label>
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
              id="crew.edit.form.label.org_contacts"
              defaultMessage="Organisation contacts (multiple)"
            />
          </legend>

          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_title">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_title"
                  defaultMessage={'Organisation contact title {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
              </label>
              <Field
                className="form-control custom-select"
                name="org_contact_title"
                component="select"
              >
                <option value="">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_title.empty"
                    defaultMessage="Please select"
                  />
                </option>
                <option value="en">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_title.mr"
                    defaultMessage="Mr."
                  />
                </option>
                <option value="it">
                  <FormattedMessage
                    id="crew.edit.form.label.org_contact_language.miss"
                    defaultMessage="Miss"
              />
                </option>
              </Field>
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_role">
                <FormattedMessage
                    id="crew.edit.form.label.org_contact_role"
                    defaultMessage={'Organisation contact role {visibility}'}
                    values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
                />
              </label>
              <Field
                  className="form-control"
                  name="org_contact_role"
                  component="input"
                  type="text"
                  value={props.org_contact_role}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_name">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_name"
                  defaultMessage={'Organisation contact name {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
              </label>
              <Field
                className="form-control"
                name="org_contact_name"
                component="input"
                type="text"
                value={props.org_contact_name}
              />
            </div>

            <div className="col-md-6 form-group">
              <label htmlFor="org_contact_surname">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_surname"
                  defaultMessage={'Organisation contact surname {visibility}'}
                  values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
              />
              </label>
              <Field
                className="form-control"
                name="org_contact_surname"
                component="input"
                type="text"
                value={props.org_contact_surname}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="org_contact_email">
              <FormattedMessage
                id="crew.edit.form.label.org_contact_email"
                defaultMessage={'Organisation contact email {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_email"
                component="input"
                type="text"
                value={props.org_contact_email}
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

          <div className="form-group">
            <label htmlFor="org_contact_language">
              <FormattedMessage
                id="crew.edit.form.label.org_contact_language"
                defaultMessage={'Organisation contact language {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <Field
              className="form-control custom-select"
              name="org_contact_language"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.empty"
                  defaultMessage="Please select"
            />
              </option>
              <option value="en">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.en"
                  defaultMessage="English"
            />
              </option>
              <option value="it">
                <FormattedMessage
                  id="crew.edit.form.label.org_contact_language.it"
                  defaultMessage="Italiano"
            />
              </option>
            </Field>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_mobile_phone">
              <FormattedMessage
                id="crew.edit.form.label.org_contact_mobile_phone"
                defaultMessage={'Organisation contact mobile phone {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_mobile_phone"
                component="input"
                type="text"
                value={props.org_contact_mobile_phone}
              />
              <div className="input-group-addon">
                <i className="fa fa-phone"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_skype">
              <FormattedMessage
                id="crew.edit.form.label.org_contact_skype"
                defaultMessage={'Organisation contact skype {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_skype"
                component="input"
                type="text"
                value={props.org_contact_skype}
              />
              <div className="input-group-addon">
                <i className="fa fa-phone"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="org_contact_facebook">
              <FormattedMessage
                id="crew.edit.form.label.org_contact_facebook"
                defaultMessage={'Organisation contact facebook {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="org_contact_facebook"
                component="input"
                type="text"
                value={props.org_contact_facebook}
              />
              <div className="input-group-addon">
                <i className="fa fa-link"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className="form-group">
          <legend>Organisation activities (multiple)</legend>

          <div className="form-group">
            <label htmlFor="activity_name">
              <FormattedMessage
                id="crew.edit.form.label.activity_name"
                defaultMessage={'Activity Name {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <Field
              className="form-control"
              name="activity_name"
              component="input"
              type="text"
              value={props.activity_name}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity_logo">
              <FormattedMessage
                id="crew.edit.form.label.activity_logo"
                defaultMessage={'Activity logo (.svg only) {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            {crew && crew.activity_logo ?
              <div>
                <img
                  className="img-thumbnail mb-3"
                  src={crew.activity_logo.publicUrl}
                  alt={`Logo of ${props.org_name}`}
                />
              </div> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(crew && crew.imageUploadInProgress)}
              onDrop={onImageDrop(props._id)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="activity_start_date">
              <FormattedMessage
                id="crew.edit.form.label.activity_start_date"
                defaultMessage={'Activity start date {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div className="input-group">
              <div className="input-group-addon">
                <i className="fa fa-calendar"></i>
              </div>
              <Field
                className="form-control"
                name="activity_start_date"
                component="input"
                type="text"
                value={props.activity_start_date}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_is_running">
              <FormattedMessage
                id="crew.edit.form.label.activity_is_running"
                defaultMessage={'Activity is running? {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div>
              <input type="radio" value="1" name="activity_is_running" /> YES
              <input type="radio" value="0" name="activity_is_running" /> NO
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="activity_end_date">
              <FormattedMessage
                id="crew.edit.form.label.activity_end_date"
                defaultMessage={'Activity end date (only if it is not running) {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div className="input-group">
              <div className="input-group-addon">
                <i className="fa fa-calendar"></i>
              </div>
              <Field
                className="form-control"
                name="activity_end_date"
                component="input"
                type="text"
                value={props.activity_end_date}
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="activity_month">
              <FormattedMessage
                id="crew.edit.form.label.activity_season"
                defaultMessage={'Activity main season {visibility}'}
                values={{visibility: <span class="badge badge-danger">PRIVATE</span>}}
            />
            </label>
            <Field
              className="form-control custom-select"
              name="activity_season"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.empty"
                  defaultMessage="Please select"
            />
              </option>
              <option value='fullyear'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.fullyear"
                  defaultMessage="Full year"
            />
              </option>
              <option value='winter'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.winter"
                  defaultMessage="Winter"
            />
              </option>
              <option value='spring'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.spring"
                  defaultMessage="Spring"
            />
              </option>
              <option value='summer'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.summer"
                  defaultMessage="Summer"
            />
              </option>
              <option value='autumn'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.autumn"
                  defaultMessage="Autumn"
            />
              </option>
              <option value='01'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.january"
                  defaultMessage="January"
            />
              </option>
              <option value='02'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.february"
                  defaultMessage="February"
            />
              </option>
              <option value='03'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.march"
                  defaultMessage="March"
            />
              </option>
              <option value='04'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.april"
                  defaultMessage="April"
            />
              </option>
              <option value='05'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.may"
                  defaultMessage="May"
            />
              </option>
              <option value='06'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.june"
                  defaultMessage="June"
            />
              </option>
              <option value='07'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.july"
                  defaultMessage="July"
            />
              </option>
              <option value='08'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.august"
                  defaultMessage="August"
            />
              </option>
              <option value='09'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.september"
                  defaultMessage="September"
            />
              </option>
              <option value='10'>
                <FormattedMessage
                id="crew.edit.form.label.activity_season.october"
                defaultMessage="October"
            />
              </option>
              <option value='11'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.november"
                  defaultMessage="November"
            />
              </option>
              <option value='12'>
                <FormattedMessage
                  id="crew.edit.form.label.activity_season.december"
                  defaultMessage="December"
            />
              </option>
            </Field>
          </div>

          <div className="form-group">
            <label htmlFor="activity_city">
              <FormattedMessage
                id="crew.edit.form.label.activity_address"
                defaultMessage={'Activity cities {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>

            <div className="input-group">
              <Field
                className="form-control"
                name="activity_city"
                component="input"
                type="text"
                value={props.activity_end_date}
              />
              <Field
                className="form-control custom-select"
                name="activity_country"
                component="select"
              >
                <option value="">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.empty"
                    defaultMessage="Please select a country"
                  />
                </option>
                <option value="en">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.en"
                    defaultMessage="English"
            />
                </option>
                <option value="it">
                  <FormattedMessage
                    id="crew.edit.form.label.activity_country.it"
                    defaultMessage="Italiano"
                  />
                </option>
              </Field>

              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_website">
              <FormattedMessage
                id="crew.edit.form.label.activity_website"
                defaultMessage={'Activity Website {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_website"
                component="input"
                type="text"
                value={props.activity_website}
              />
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_profiles">
              <FormattedMessage
                id="crew.edit.form.label.activity_web_social_channels"
                defaultMessage={'Activity Web & Social Channels {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_web_social_channels"
                component="input"
                type="text"
                value={props.activity_profiles}
              />
              <div className="input-group-addon">
                <i className="fa fa-minus"></i>
              </div>
              <div className="input-group-addon">
                <i className="fa fa-plus"></i>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_instagram">
              <FormattedMessage
                id="crew.edit.form.label.activity_public_email"
                defaultMessage={'Activity Public Email {visibility}'}
                values={{visibility: <span class="badge badge-success">PUBLIC</span>}}
            />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="activity_public_email"
                component="input"
                type="text"
                value={props.activity_public_email}
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
