import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Abouts from '../about/Abouts';
import ProfileLinksWeb from './ProfileLinksWeb';
import ProfileLinksSocial from './ProfileLinksSocial';
import ProfileAddressesPublic from './ProfileAddressesPublic';
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
  aboutDelete,
  userLinkDelete,
  userAddressDelete,
  fetchCountries
  }) => {

  if (!user) {
    console.log('ProfilePublic ERROR user not defined');
  }
  if (!user._countries) {
    fetchCountries();
  }

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

            <label htmlFor="username">
              <FormattedMessage
                id="username"
                defaultMessage="username"
              />
            </label>
            <Field
              className="form-control"
              name="username"
              component="input"
              value={user.username}
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

          <Abouts
            current={user}
            intl={intl}
            aboutDelete={aboutDelete}
          />

          <ProfileLinksWeb
            user={user}
            intl={intl}
            userLinkDelete={userLinkDelete}
          />

          <ProfileLinksSocial
            user={user}
            intl={intl}
            userLinkDelete={userLinkDelete}
          />
          <ProfileAddressesPublic
            user={user}
            intl={intl}
            userAddressDelete={userAddressDelete}
          />

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
