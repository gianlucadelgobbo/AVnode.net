import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from './Layout';

const Preferences = ({ user, changeLanguage, onSubmit, intl }) => {
  const onChange = ({ target: { value } }) => {
    if (value !== '') {
      changeLanguage(value);
    }
  };
  return (
    <Layout
      title={intl.formatMessage({
        id: 'preferences.edit.form.title',
        defaultMessage: 'Your Preferences'
      })}
    >
      <form onSubmit={onSubmit} onChange={onChange}>
        <div className="form-group">
          <label htmlFor="gender">
            <FormattedMessage
              id="user.edit.form.label.language"
              defaultMessage="Language"
            />
          </label>
          <Field
            className="form-control custom-select"
            name="language"
            component="select"
          >
            <option value="">
              <FormattedMessage
                id="user.edit.form.label.language.empty"
                defaultMessage="Please select"
              />
            </option>
            <option value="en">
              <FormattedMessage
                id="user.edit.form.label.language.en"
                defaultMessage="English"
              />
            </option>
            <option value="de">
              <FormattedMessage
                id="user.edit.form.label.language.de"
                defaultMessage="German"
              />
            </option>
            <option value="fr">
              <FormattedMessage
                id="user.edit.form.label.language.fr"
                defaultMessage="French"
              />
            </option>
          </Field>
        </div>
      </form>
    </Layout>
  );
};

export default injectIntl(reduxForm({ form: 'user' })(Preferences));
