import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Languages from '../language/Languages';
import renderLabel from '../renderLabel';

const Abouts = injectIntl(({
  fields,
  onSwitchLanguage,
  meta: { error, submitFailed },
  intl
}) => (
    <div>
      <legend>
        <FormattedMessage
          id="abouts"
          defaultMessage="About you..."
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}
      <div className="container-fluid">
        <nav className="nav-justified pull-left">
          {Languages.map((c) => (
            <a
              className="nav-link active"
              href={c.code}
              onClick={
                e => {
                  e.preventDefault();
                  console.log( e.target.__preactattr_.href);
                  onSwitchLanguage(e.target.__preactattr_.href);
                }
              }>
              {c.language}
            </a>
          ))}
        </nav>
      </div>
      {fields.map((about, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-sm-10 input-group">
              <label htmlFor="aboutlanguage">
                <FormattedMessage
                  id="aboutTitle"
                  defaultMessage="About section in language:"
                />
              </label>
              <Field
                className="form-control"
                name={`${about}.lang`}
                component={renderLabel}
              />
            </div>

          </div>
          <div className="col-sm-12 input-group">
            <Field
              className="form-control"
              name={`${about}.abouttext`}
              component="textarea"
              type="hidden"
              rows="4"
              placeholder={intl.formatMessage({
                id: 'about.placeholder',
                defaultMessage: 'About'
              })}
            />
          </div>
        </div>
      ))}
    </div>
  ));
export default Abouts;
