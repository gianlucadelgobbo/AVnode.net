import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Links = ({ link }) => {
    return (
      <li className="list-group-item justify-content-between">
        {link.url}
        {link.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="user.edit.form.label.link.badge.primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
      </li>
    );
  };

  export default Links;