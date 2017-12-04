import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from './About';
import Languages from '../language/Languages';

const ProfileAboutsForm = injectIntl(({
  current,
  intl,
  aboutDelete
}) => {

  const onAboutDelete = (about) => (e) => {
    console.log('onAboutDelete' + about);
    return aboutDelete(current._id, about.lang);
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
            defaultMessage: 'About'
          })}
        />
      </div>
      <div className="row">
        <div className="col-sm-10 input-group">
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
        <div className="col-sm-2 input-group-addon">
          <button className="btn btn-success btn-sm">
            <i className="fa fa-plus"></i>
          </button>
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
          current && current.abouts && current.abouts.map((a) => (
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