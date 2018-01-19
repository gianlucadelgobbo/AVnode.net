import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import renderLabel from '../renderLabel';
import Languages from '../language/Languages';

const Abouts = injectIntl(({
  fields,
  selectedLanguage,
  onSwitchLanguage,
  meta: { error, submitFailed },
  intl
}) => {


  return (
    
  <fieldset>
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
              className="nav-link"
              href={c.index}
              onClick={
                e => {
                  onSwitchLanguage(e);
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
      {console.log( 'selected:' + selectedLanguage )}
            <Field
              className="form-control"
              name={`${about}.abouttext`}
              component="textarea"
              style={{display: index==selectedLanguage ? 'block' : 'none'}}
              rows="12"
              placeholder={intl.formatMessage({
                id: 'about.placeholder',
                defaultMessage: 'About'
              })}
            />
          </div>
        </div>
      ))}
    </div>
    </fieldset>
  );}
);
export default Abouts;
