import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Languages from '../language/Languages';

const Abouts = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => (
    <fieldset>
      <legend>
        <FormattedMessage
          id="abouts"
          defaultMessage="About you..."
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      {fields.length == 0 ? fields.push() : ''}

      {fields.map((about, index) => (
        <div key={index}>
          <div className="container">
            <div>
              <div className="container-fluid">
                <nav class="nav-justified pull-left">
                  {Languages.map((c) => (
                    <a class="nav-link active" href={c.language}>{c.language}</a>
                  ))
                  }
                </nav>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {Languages.map((c) => (
                    <Field
                      className="form-control"
                      name={`${about}.abouttext`}
                      component="textarea"
                      rows="8"
                      placeholder={intl.formatMessage({
                        id: 'about.placeholder',
                        defaultMessage: c.language
                      })}
                    />
                  ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  ));
export default Abouts;
