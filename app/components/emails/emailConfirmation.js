import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const emailConfirmation = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    {console.log('emailConfirmation:' + JSON.stringify(input) + input.value)}
    {input.value ?
      <span className="badge badge-success">
        <FormattedMessage
          id="confirmed"
          defaultMessage="Confirmed"
        />
      </span>
      :
      <button
        type="button"
        className="btn btn-info btn-sm"
      >
        <i
          className="fa fa-envelope"
          data-toggle="tooltip"
          data-placement="top"
          title='Confirm'
        >
        </i>
      </button>
    }
  </div>
);

export default emailConfirmation;
/*
              <div className="col-sm-1">
                <label
                  
                  className="btn btn-info btn-sm"
                  onClick={() => onConfirm(userId, index)}
                >
                  <Field
                    className="form-control"
                    name={`${email}.is_confirmed`}
                    component={emailConfirmation}
                  />
                </label>
              </div>
<label>{label}</label>
      <div>
        <input {...input} placeholder={label} type={type}/>
        {touched && error && <span>{error}</span>}
      </div>
input.value ?
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
                </span>*/