import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import PublicLinkTypes from './PublicLinkTypes';

const Links = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => (
    <div>
      <legend>
        <FormattedMessage
          id="links"
          defaultMessage="Links"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      {fields.map((link, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-sm-8 input-group">              
              <Field
                className="form-control"
                name={`${link}.url`}
                component="input"
                placeholder={intl.formatMessage({
                  id: 'url.placeholder',
                  defaultMessage: 'Url'
                })}
              />
            </div>
            <div className="col-sm-4 input-group">
            {PublicLinkTypes ?
              <Field
                className="form-control custom-select"
                name={`${link}.type`}
                component="select"
              >
                {PublicLinkTypes.map((c) => (
                  <option value={c.key.toLowerCase()}>{c.name}</option>
                ))
                }
              </Field> :
              <p>Loading a link types…</p>
            }
            </div>
            {/*<div className="col-sm-1">
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
                </div>*/}
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
          id="addLink"
          defaultMessage="Add Link"
        />
      </label>
    </div>
  ));
export default Links;
