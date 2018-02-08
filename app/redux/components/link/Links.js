import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';
import renderField from '../renderField';

const Links = injectIntl(({
  fields,
<<<<<<< HEAD
  meta: { error, submitFailed, touched},
=======
  meta: { touched, error, submitFailed },
>>>>>>> d194a8ff2e8d33ae78d1fd120e763d095205cb2c
  intl
}) => (
    <fieldset>
      <label>
        <FormattedMessage
          id="websites"
          defaultMessage="Websites"
        />
      </label>
      {submitFailed && error && <span>{error}</span>}

      {fields.length == 0 ? fields.push() : ''}

      {fields.map((link, index) => (
        <div key={index}>
          <div className="input-group mb-3">
            <Field
              className="form-control"
<<<<<<< HEAD
              name={`${link}.url`}
              type="text"
              component={renderField}
=======
              type="text"
              name={`${link}.url`}
              component={renderField}          
              placeholder={intl.formatMessage({
                id: 'url.placeholder',
                defaultMessage: 'Url'
              })}
>>>>>>> d194a8ff2e8d33ae78d1fd120e763d095205cb2c
            />
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
