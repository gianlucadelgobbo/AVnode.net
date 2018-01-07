import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import renderLabel from '../renderLabel';
import Languages from '../language/Languages';

const Abouts = injectIntl(({
  fields,
  //languages,
  meta: { error, submitFailed },
  intl
}) => {

  let selectedLanguage = 0;

  const onSwitchLanguage = (e) => {
    e.preventDefault();
    selectedLanguage = e.target.__preactattr_.href;
    console.log( 'selectedLanguage:' + selectedLanguage );
    console.log( 'languages' + JSON.stringify(Languages));
    fields.map((about, index) => (
      console.log(about, index)
    ));
  };

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
              className="nav-link active"
              href={c.index}
              onClick={
                e => {
                  //console.log( e.target.__preactattr_.href + 's' + selectedLanguage);
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
