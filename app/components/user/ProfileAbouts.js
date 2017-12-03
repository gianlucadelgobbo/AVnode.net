import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from '../about/About';
import Languages from '../language/Languages';

const ProfileAboutsForm = injectIntl(({
  user,
  intl,
  userAboutDelete
}) => {

  const onAboutDelete = (about) => (e) => {
    console.log('onAboutDelete' + about);
    return userAboutDelete(user._id, about.lang);
  };
  return (
    <fieldset className="form-group">
      <legend>
        <FormattedMessage
          id="abouts"
          defaultMessage="About you..."
        />
      </legend>

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
        />
      </div>
      <div className="form-group">
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
      <div className="input-group-addon">
          <button
            className="btn btn-success btn-sm"
          >
            <i className="fa fa-plus"></i>
          </button>
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
              onDelete={onAboutDelete(a)}
              intl={intl}
            />
          ))
        }
      </ul>
    </fieldset>
  );
});

export default ProfileAboutsForm;