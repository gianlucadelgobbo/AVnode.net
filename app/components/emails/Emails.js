import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { Field } from 'redux-form';
import renderField from '../renderField';

const Emails = injectIntl(({
  fields,
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

      {fields.map((email, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-sm-8 input-group">
              <Field
                className="form-control"
                name={`${email}.email`}
                component={renderField}
                placeholder={intl.formatMessage({
                  id: 'email.placeholder',
                  defaultMessage: 'email@example.com'
                })}
              />
            </div>
            <div className="col-sm-3 input-group">
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
            {/*<div className="col-sm-3 input-group">
              {`${email}.is_confirmed` ?
                <span className="badge badge-success">
                  <FormattedMessage
                    id="confirmed"
                    defaultMessage="Confirmed"
                  />
                </span> :
                <span className="badge badge-info">
                  <FormattedMessage
                    id="unconfirmed"
                    defaultMessage="Unconfirmed"
                  />
                </span>
              }
            </div>*/}

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


/*
const Email = ({ email, onMakePrimary, onMakePrivate, onMakePublic, onConfirm, onDelete, intl }) => {

  return (
    <li className="list-group-item justify-content-between">
      {email.email}
      <span>
        {email.is_confirmed ?
          <span className="badge badge-success">
            <FormattedMessage
              id="confirmed"
              defaultMessage="Confirmed"
            />
          </span> :
          <span className="badge badge-info">
            <FormattedMessage
              id="unconfirmed"
              defaultMessage="Unconfirmed"
            />
          </span>
        }
        {email.is_public ?
          <span className="badge badge-success">
            <FormattedMessage
              id="public"
              defaultMessage="Public"
            />
          </span>
          :
          <span className="badge badge-warning">
            <FormattedMessage
              id="private"
              defaultMessage="Private"
            />
          </span>
        }
        {email.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
      </span>
      <span>
        {email.is_confirmed ? null :
          <button
            type="button"
            className="btn btn-info btn-sm"
            onClick={onConfirm}
          >
            <i
              className="fa fa-check-circle"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: "confirm",
                defaultMessage: "Confirm"
              })}
            >
            </i>
          </button>
        }
        {email.is_public ?
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onMakePrivate}
          >
            <i
              className="fa fa-shield"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: "makeitprivate",
                defaultMessage: "Make it private"
              })}
            >
            </i>
          </button>
          :
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={onMakePublic}
          >
            <i
              className="fa fa-exchange"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: "makeitpublic",
                defaultMessage: "Make it public"
              })}
            >
            </i>
          </button>
        }
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onMakePrimary}
        >
          <i
            className="fa fa-star"
            data-toggle="tooltip"
            data-placement="top"
            title={intl.formatMessage({
              id: "makeitprimary",
              defaultMessage: "Make it primary"
            })}
          >
          </i>
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          <i
            className="fa fa-trash"
            data-toggle="tooltip"
            data-placement="top"
            title={intl.formatMessage({
              id: "delete",
              defaultMessage: "Delete"
            })}
          >
          </i>
        </button>
      </span>
    </li>
  );
};

export default Email;*/