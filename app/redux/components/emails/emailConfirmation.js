import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const emailConfirmation = ({ input, label, type, meta: { touched, error } }) => (
  <div>
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
