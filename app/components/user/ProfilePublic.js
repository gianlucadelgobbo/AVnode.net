import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import About from '../about/About';
import Languages from '../language/Languages';
//import WebLinkTypes from '../link/WebLinkTypes';
import LinkWeb from '../link/LinkWeb';
//import LinkSocial from '../link/LinkSocial';
import AddressPublic from '../place/AddressPublic';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import ProfileLinksWeb from './ProfileLinksWeb';
import ProfileLinksSocial from './ProfileLinksSocial';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePublic = ({
  user,
  //submitting,
  dirty,
  invalid,
  pristine,
  valid,
  intl,
  handleSubmit,
  saveProfile,
  userAboutEdit,
  userAboutDelete,
  //  userLinkMakePrimary,
  userLinkDelete,
  //userLinkEdit,
  userAddressDelete,
  fetchCountries
  }) => {

  if (!user) {
    console.log('ProfilePublic ERROR user not defined');
  }
  if (!user._countries) {
    fetchCountries();
  }


  const onAboutEdit = (about) => (e) => {
    e.preventDefault();
    console.log('dirty:' + dirty + ' invalid:' + invalid + ' pristine:' + pristine + ' valid:' + valid);
    return userAboutEdit(user._id, about.lang);
  };
  const onAboutDelete = (about) => (e) => {
    e.preventDefault();
    return userAboutDelete(user._id, about.lang);
  };

  /*const onLinkEdit = (link) => (e) => {
    e.preventDefault();
    return userLinkEdit(user._id, link._id);
  };*/
  const onLinkDelete = (link) => (e) => {
    e.preventDefault();
    return userLinkDelete(user._id, link._id);
  };
  const onUserAddressDelete = (userId) => (address) => (e) => {
    userAddressDelete(userId, address._id);
  };

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(saveProfile)}>
          <Field
            name="_id"
            component="input"
            type="hidden"
          />
          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="myAccountPublicData"
                defaultMessage="My Account Public data"
              />
            </legend>

          </fieldset>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="details"
                defaultMessage="Details"
              />
            </legend>

            <label htmlFor="stagename">
              <FormattedMessage
                id="stagename"
                defaultMessage="Stagename"
              />
            </label>
            <Field
              className="form-control"
              name="stagename"
              component="input"
              value={user.stagename}
            />
            <label htmlFor="slug">
              <FormattedMessage
                id="slug"
                defaultMessage="Profile url"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="slug"
                component="input"
                value={user.slug}
              />
            </div>
            <p>
              {user.publicUrl}
            </p>

            <p>
              <FormattedMessage
                id="url.change.disclaimer"
                defaultMessage="Changing your url can have unintended side effects!"
              />
            </p>
          </fieldset>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="abouts"
                defaultMessage="About you..."
              />
            </legend>

            <div className="row">
              <div className="col-md-9 form-group">
                <label htmlFor="about">
                  <FormattedMessage
                    id="addabout"
                    defaultMessage="About you"
                  />
                </label>
                <div className="input-group">
                  <Field
                    className="form-control"
                    name="about"
                    component="textarea"
                    rows="4"
                    placeholder={intl.formatMessage({
                      id: 'about.placeholder',
                      defaultMessage: 'Tell me something about you.'
                    })}
                    value={user.about}
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
                    value={user.aboutlanguage}
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
                user && user.abouts && user.abouts.map((a) => (
                  <About
                    about={a}
                    onEdit={onAboutEdit(a)}
                    onDelete={onAboutDelete(a)}
                    intl={intl}
                  />
                ))
              }
            </ul>
          </fieldset>

          <fieldset>
            <ul className="list-group mt-2">
              <ProfileLinksWeb
                user={user}
                intl={intl}
              />
            </ul>
          </fieldset>

          <fieldset>
            <ul className="list-group mt-2">
              <ProfileLinksSocial
                user={user}
                intl={intl}
              />
            </ul>
          </fieldset>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="address"
                defaultMessage="Address"
              />
            </legend>
            <div className="row">
              <div className="col-md-9 form-group">
                <label htmlFor="locality">
                  <FormattedMessage
                    id="locality"
                    defaultMessage="Locality"
                  />
                </label>
                <Field
                  className="form-control"
                  name="locality"
                  component="input"
                  placeholder='Locality'
                  value={user.locality}
                />
              </div>
              <div className="col-md-3 form-group">
                <label htmlFor="country">
                  <FormattedMessage
                    id="country"
                    defaultMessage="Country"
                  />
                </label>
                {user._countries ?
                  <Field
                    className="form-control custom-select"
                    name="country"
                    component="select"
                    value={user.country}
                  >
                    <option value="">
                      <FormattedMessage
                        id="Please select"
                        defaultMessage="Please select"
                      />
                    </option>
                    {user._countries.map((c) => (
                      <option value={c.name}>{c.name}</option>
                    ))
                    }
                    { /* FIXME: How do we handle countries here? */}
                  </Field> :
                  <p>Loading a list of countries…</p>
                }
              </div>
            </div>
            <label>
              <FormattedMessage
                id="editFullAddress"
                defaultMessage="Edit full address in the private section"
              />
            </label>
            <ul className="list-group mt-2">
              {
                user && user.addresses && user.addresses.map((a) => (
                  <AddressPublic
                    address={a}
                    onDelete={onUserAddressDelete(user._id)(a)}
                    intl={intl}
                  />
                ))
              }
            </ul>
          </fieldset>

          <div className="form-group">
            <button
              className="btn btn-primary"
              // disabled={submitting}
              type="submit"
            >
              <FormattedMessage
                id="form.save"
                defaultMessage="Save"
              />
            </button>
          </div>
        </form>
      </Layout >
    </div>
  );
};

export default injectIntl(reduxForm({
  form: 'userPublic',
  enableReinitialize: true,
  //keepDirtyOnReinitialize: true,
  validate
})(ProfilePublic));
