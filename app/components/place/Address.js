import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Address = ({ address }) => {
    return (
      <li className="list-group-item justify-content-between">
        {address.name} : {address.formatted_address}
        {address.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="user.edit.form.label.address.badge.primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
        {address.is_public ?
          <span className="badge badge-default">
            <FormattedMessage
              id="user.edit.form.label.address.badge.public"
              defaultMessage="Public"
            />
          </span> :
          <span className="badge badge-default">
            <FormattedMessage
              id="user.edit.form.label.address.badge.private"
              defaultMessage="Private"
            />
          </span>
        }
      </li>
    );
  };

  export default Address;