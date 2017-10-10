import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from './Layout';

const Preferences = ({ user, changeLanguage, onSubmit, intl }) => {
  const onChange = ({ target: { value } }) => {
    if (value !== '') {
      changeLanguage(value, user._id);
    }
  };
  return (
    <Layout
      title={intl.formatMessage({
        id: 'Title',
        defaultMessage: 'Your Preferences'
      })}
    >
      <form onSubmit={onSubmit} onChange={onChange}>
        <div className="form-group">
          <label htmlFor="language">
            <FormattedMessage
              id="language"
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
                id="Please select"
                defaultMessage="Please select"
              />
            </option>
            <option value="en">
              <FormattedMessage
                id="language.en"
                defaultMessage="English"
              />
            </option>
            <option value="de">
              <FormattedMessage
                id="language.de"
                defaultMessage="German"
              />
            </option>
            <option value="fr">
              <FormattedMessage
                id="language.fr"
                defaultMessage="French"
              />
            </option>
            <option value="it">
              <FormattedMessage
                id="language.it"
                defaultMessage="Italian"
              />
            </option>
          </Field>
        </div>
      </form>
    </Layout>
  );
};

export default injectIntl(reduxForm({ form: 'user' })(Preferences));
