import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Email = ({ email }) => {
    return (
      <li className="list-group-item justify-content-between">
        {email.email}
        {email.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
        {email.is_confirmed ?
          <span className="badge badge-success">
            <FormattedMessage
              id="confirmed"
              defaultMessage="Confirmed"
            />
          </span> :
          <span className="badge badge-danger">
            <FormattedMessage
              id="unconfirmed"
              defaultMessage="Unconfirmed"
            />
          </span>
        }
        {email.is_public ?
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
        <span className="input-group-btn">
          {!email.is_primary ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="makeitprimary"
                defaultMessage="Make it primary"
              />
            </button> :
            null
          }
          {email.is_public ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="makeitprivate"
                defaultMessage="Make it private"
              />
            </button> :
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="makeitpublic"
                defaultMessage="Make it public"
              />
            </button>
          }
          {!email.is_primary ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="delete"
                defaultMessage="Delete"
              />
            </button> :
            null
          }
        </span>
      </li>
    );
  };

  export default Email;