import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Link = ({ link }) => {
    return (
      <li className="list-group-item justify-content-between">
        {link.type} : {link.url}
        {link.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="user.edit.form.label.link.badge.primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
        {link.is_confirmed ?
          <span className="badge badge-success">
            <FormattedMessage
              id="user.edit.form.label.link.badge.confirmed"
              defaultMessage="Confirmed"
            />
          </span> :
          <span className="badge badge-danger">
            <FormattedMessage
              id="user.edit.form.label.link.badge.unconfirmed"
              defaultMessage="Unconfirmed"
            />
          </span>
        }
        {link.is_public ?
          <span className="badge badge-default">
            <FormattedMessage
              id="user.edit.form.label.link.badge.public"
              defaultMessage="Public"
            />
          </span> :
          <span className="badge badge-default">
            <FormattedMessage
              id="user.edit.form.label.link.badge.private"
              defaultMessage="Private"
            />
          </span>
        }
        <span className="input-group-btn">
          {!link.is_primary ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="user.edit.form.label.link.action.primary"
                defaultMessage="Make it primary"
              />
            </button> :
            null
          }
          {link.is_public ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="user.edit.form.label.link.action.private"
                defaultMessage="Make it private"
              />
            </button> :
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="user.edit.form.label.link.action.public"
                defaultMessage="Make it public"
              />
            </button>
          }
          {!link.is_primary ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <FormattedMessage
                id="user.edit.form.label.link.action.delete"
                defaultMessage="Delete"
              />
            </button> :
            null
          }
        </span>
      </li>
    );
  };

  export default Link;