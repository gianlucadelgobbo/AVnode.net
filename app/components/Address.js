import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Address = ({ address }) => {
    return (
      <li className="list-group-item justify-content-between">
        {address.address}
        {address.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="user.edit.form.label.address.badge.primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
      </li>
    );
  };

  export default Address;