import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';
//import PublicLinkTypes from './PublicLinkTypes';

const Links = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => (
    <fieldset>
      <legend>
        <FormattedMessage
          id="websites"
          defaultMessage="Websites"
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
            <Field
              name={`${link}.type`}
              component="input"
              type="hidden"
              value="web"
            />
            {/*console.log(PublicLinkTypes)*/}
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
export default Links;
