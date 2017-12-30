import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';
import renderField from '../renderField';
import emailConfirmation from './emailConfirmation';
import emailPrivacy from './emailPrivacy';
import emailPrimary from './emailPrimary';

const Emails = injectIntl(({
  fields,
  onConfirm,
  onTogglePrivacy,
  onMakePrimary,
  userId,
  meta: { error, submitFailed },
  intl
}) => (
    <div>
      <legend>
        <FormattedMessage
          id="emails"
          defaultMessage="Emails"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}
      {/*console.log('userId:' + userId)*/}
      {fields.map((email, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-sm-7 input-group">
              <Field
                className="form-control"
                name={`${email}.email`}
                component={renderField}
                label="email"
                placeholder={intl.formatMessage({
                  id: 'email.placeholder',
                  defaultMessage: 'email@example.com'
                })}
              />
            </div>
            <div className="col-sm-2 input-group">
              <label className="form-check-label">
                <Field
                  className="form-check-input form-control-lg"
                  name={`${email}.is_public`}
                  component="input"
                  type="checkbox"
                />
                <FormattedMessage
                  id="public"
                  defaultMessage="Public"
                />
              </label>
            </div>
            <div
              className="col-sm-1 input-group"
              onClick={() => onTogglePrivacy(userId, index)}
            >
              <Field
                className="form-control"
                name={`${email}.is_public`}
                component={emailPrivacy}
              />
            </div>
           <div
              className="col-sm-1 input-group"
              onClick={() => onMakePrimary(userId, index)}
            >
              <Field
                className="form-control"
                name={`${email}.is_primary`}
                component={emailPrimary}
              />
            </div>
            <div
              className="col-sm-1 input-group"
              onClick={() => onConfirm(userId, index)}
            >
              <Field
                className="form-control"
                name={`${email}.is_confirmed`}
                component={emailConfirmation}
              />
            </div>

            <div className="col-sm-1">
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
          id="addEmail"
          defaultMessage="Add Email"
        />
      </label>
    </div>
  ));

export default Emails;
