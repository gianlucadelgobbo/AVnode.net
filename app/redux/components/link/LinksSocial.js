import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import SocialLinkTypes from './SocialLinkTypes';

const LinksSocial = injectIntl(({
  user,
<<<<<<< HEAD
  onSwitchLanguage,
=======
>>>>>>> ac957a881f670a7a29fbae9cd4ac84d746b5975a
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
             {/*<Field
              name={`${link}.type`}
              component={({ input, val }) => input.onChange(val)}
              val="social"
             />*/}
            {/*SocialLinkTypes ?
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
              */}
            <span className="input-group-btn">
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
            </span>
<<<<<<< HEAD
            {user!==undefined ?
            <span className="input-group-btn">
            <a href="#" className="btn btn-primary">
            <i
                className="fa fa-link"
                data-toggle="tooltip"
                data-placement="top"
                title={intl.formatMessage({
                  id: 'link',
                  defaultMessage: 'Link'
                })}
              >
              </i>
            </a>
            </span>
           :
           null
           }
=======
>>>>>>> ac957a881f670a7a29fbae9cd4ac84d746b5975a
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
