import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Connections = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => (
    <fieldset>
      <legend>
        <FormattedMessage
          id="connections"
          defaultMessage="Connections"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      {fields.length == 0 ? fields.push() : ''}

      {fields.map((connection, index) => (
        <div key={index}>

          <div className="input-group mb-3">
            <Field
              className="form-control"
              name={`${connection}`}
              component="input"
              placeholder={intl.formatMessage({
                id: 'connection',
                defaultMessage: 'Connection'
              })}
            />

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
            id="add"
            defaultMessage="Add"
          />
        </button>
      </div>
    </fieldset>
  ));
export default Connections;
