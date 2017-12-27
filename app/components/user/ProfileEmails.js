import { h } from 'preact';
// import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Email from '../emails/Email';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';

const ProfileEmailsForm = ({
  user,
  intl,
  handleSubmit,
  userEmailMakePrimary,
  userEmailMakePrivate,
  userEmailMakePublic,
  userEmailConfirm,
  userEmailDelete,
  saveProfile
  }) => {

  const onUserEmailMakePrimary = (userId) => (email) => (e) => {
    userEmailMakePrimary(userId, email._id);
  };
  const onUserEmailMakePrivate = (userId) => (email) => (e) => {
    userEmailMakePrivate(userId, email._id);
  };
  const onUserEmailMakePublic = (userId) => (email) => (e) => {
    userEmailMakePublic(userId, email._id);
  };
  const onUserEmailConfirm = (userId) => (email) => (e) => {
    userEmailConfirm(userId, email._id);
  };
  const onUserEmailDelete = (userId) => (email) => (e) => {
    userEmailDelete(userId, email._id);
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

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="emails"
              defaultMessage="Emails"
            />
          </legend>

          <div className="form-group">
            <label htmlFor="email">
              <FormattedMessage
                id="email"
                defaultMessage="Primary email, change to add new email"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="email"
                component="input"
                placeholder={intl.formatMessage({
                  id: 'email.placeholder',
                  defaultMessage: 'foo@example.com'
                })}
              />

            </div>
            <label>
              <FormattedMessage
                id="manageemail"
                defaultMessage="Manage your email addresses"
              />
            </label>
            <ul className="list-group mt-2">
              {user && user.emails && user.emails.map((e) => (
                <Email
                  email={e}
                  onMakePrimary={onUserEmailMakePrimary(user._id)(e)}
                  onMakePrivate={onUserEmailMakePrivate(user._id)(e)}
                  onMakePublic={onUserEmailMakePublic(user._id)(e)}
                  onConfirm={onUserEmailConfirm(user._id)(e)}
                  onDelete={onUserEmailDelete(user._id)(e)}
                  intl={intl}
                />
              ))
              }
            </ul>
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
    </Layout >
    </div>
  );
};

export default injectIntl(reduxForm({
  form: 'userEmails',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ProfileEmailsForm));
