import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Email from '../emails/Email';
import Layout from '../Layout';
import {
    emailUserMakePrimary,
    editUserEmails
} from '../../reducers/actions';
import Languages from '../language/Languages';

const ProfileEmailsForm = ({
    user,
    intl,
    handleSubmit,
    emailUserMakePrimary,
    saveProfile
    }) => {

    const onEmailUserMakePrimary = (userId) => (email) => (e) => {
        // useless email.is_primary = true;
        emailUserMakePrimary(userId, email._id);
    };

    return (
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
                  onMakePrimary={onEmailUserMakePrimary(user._id)(e)}

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
    );
};

export default injectIntl(reduxForm({
    form: 'useremails',
    enableReinitialize: true
})(ProfileEmailsForm));
