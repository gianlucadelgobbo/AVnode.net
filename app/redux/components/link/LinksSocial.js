import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import SocialLinkTypes from './SocialLinkTypes';

const LinksSocial = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
  }) => (
    <fieldset>
      <legend>
        <FormattedMessage
          id="socials"
          defaultMessage="Social channels"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      {fields.length == 0 ? fields.push() : ''}

      {fields.map((link, index) => (
        <div key={index}>
          <div className="input-group mb-3">
            <Field
              className="form-control"
              name={`${link}.url`}
              component="input"
              placeholder={intl.formatMessage({
                id: 'url.placeholder',
                defaultMessage: 'Url'
              })}
            />
            {SocialLinkTypes ?
              <Field
                className="form-control custom-select"
                name={`${link}.type`}
                component="select"
              >
                {SocialLinkTypes.map((c) => (
                  <option value={c.key.toLowerCase()}>{c.name}</option>
                ))
                }
              </Field> :
              <p>Loading a link types…</p>
            }

            <button
              type="button"
              className="btn btn-danger"
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
      ))}
      <div className="text-right">
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
          &nbsp;
          <FormattedMessage
            id="addLink"
            defaultMessage="Add Link"
          />
        </button>
      </div>
    </fieldset>
  ));

export default LinksSocial;