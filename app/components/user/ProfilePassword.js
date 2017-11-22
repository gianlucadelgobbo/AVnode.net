import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Modal from '../Modal';
import Layout from '../Layout';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePassword = ({
  user,
  //submitting,
  openPasswordModal,
  closePasswordModal,
  intl,
  handleSubmit,
  saveProfile
  }) => {


  const handleChange = () => {
    console.log(user);
  }

  return (
    <div className="container-fluid account-nav-wrap">
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(saveProfile)}>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="password"
                defaultMessage="Password"
              />
            </legend>


              <div className="form-group">
                <label htmlFor="currentPassword">
                  <FormattedMessage
                    id="currentPassword"
                    defaultMessage="Current Password"
                  />
                </label>
                <Field
                  className="form-control"
                  name="currentPassword"
                  component="input"
                  type="password"
                  placeholder={intl.formatMessage({
                    id: 'password.placeholder',
                    defaultMessage: 'PASSWORD'
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">
                  <FormattedMessage
                    id="newPassword"
                    defaultMessage="New Password"
                  />
                </label>
                <Field
                  className="form-control"
                  name="newPassword"
                  component="input"
                  type="password"
                  placeholder={intl.formatMessage({
                    id: 'newPassword.placeholder',
                    defaultMessage: 's0m3th|ngS3cr37'
                  })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">
                  <FormattedMessage
                    id="confirmNewPassword"
                    defaultMessage="Confirm Password"
                  />
                </label>
                <Field
                  className="form-control"
                  name="confirmNewPassword"
                  component="input"
                  type="password"
                  placeholder={intl.formatMessage({
                    id: 'newPassword.placeholder',
                    defaultMessage: 's0m3th|ngS3cr37'
                  })}
                />
              </div>
          </fieldset>

          <div className="form-group">
            <button
              className="btn btn-primary"
              // disabled={submitting}
              type="submit"
            >
              <FormattedMessage
                id="password.change"
                defaultMessage="Change your password"
              />
            </button>
          </div>
        </form>
      </Layout >
    </div>
  );
};

export default injectIntl(reduxForm({
  form: 'user',
  enableReinitialize: true,
  validate
})(ProfilePassword));
