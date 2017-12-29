import { h } from 'preact';
import { Field } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Connections = injectIntl(({
  fields,
  meta: { error, submitFailed },
  intl
}) => (
    <div>
      <legend>
        <FormattedMessage
          id="connections"
          defaultMessage="Connections"
        />
      </legend>
      {submitFailed && error && <span>{error}</span>}

      {fields.map((connection, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-sm-11 input-group">              
              <Field
                className="form-control"
                name={`${connection}`}
                component="input"
                placeholder={intl.formatMessage({
                  id: 'connection',
                  defaultMessage: 'Connection'
                })}
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
          id="add"
          defaultMessage="Add"
        />
      </label>
    </div>
  ));
export default Connections;
