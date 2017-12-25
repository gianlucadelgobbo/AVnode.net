import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Languages from '../language/Languages';

const Abouts = injectIntl(({
  fields,
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
              {Languages ?
                <Field
                  className="form-control custom-select"
                  name={`${about}.lang`}
                  component="select"
                >
                  <option value="">Select</option>
                  {Languages.map((c) => (
                    <option value={c.code}>{c.language}</option>
                  ))
                  }
                </Field> :
                <p>Loading languages…</p>
              }
            </div>
            <div className="col-sm-2 ">
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => fields.remove(index)}
              >
                <i
                  className="fa fa-trash"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={intl.formatMessage({
                    id: 'delete',
                    defaultMessage: 'Delete'
                  })}
                >
                </i>
              </button>
            </div>
          </div>
          <div className="col-sm-12 input-group">
            <Field
              className="form-control"
              name={`${about}.abouttext`}
              component="textarea"
              rows="4"
              placeholder={intl.formatMessage({
                id: 'about.placeholder',
                defaultMessage: 'About'
              })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => fields.push({})}>
        <i
          className="fa fa-plus"
          data-toggle="tooltip"
          data-placement="top"
          title={intl.formatMessage({
            id: 'add',
            defaultMessage: 'Add'
          })}
        >
        </i>
      </button>
      <label>
        <FormattedMessage
          id="addabout"
          defaultMessage="Add About section"
        />
      </label>
    </div>
  ));
export default Abouts;
