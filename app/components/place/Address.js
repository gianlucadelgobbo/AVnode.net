import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Address = ({ address }) => {
    return (
      <li className="list-group-item justify-content-between">
        {address.placename} : {address.formatted_address}
        {address.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
        {address.is_public ?
          <span className="badge badge-default">
            <FormattedMessage
              id="public"
              defaultMessage="Public"
            />
          </span> :
          <span className="badge badge-default">
            <FormattedMessage
              id="private"
              defaultMessage="Private"
            />
          </span>
        }
      </li>
    );
  };

  export default Address;