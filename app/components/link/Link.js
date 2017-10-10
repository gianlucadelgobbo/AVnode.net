import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Link = ({ link }) => {
    return (
      <li className="list-group-item justify-content-between">
        {link.type} : {link.url}
        {link.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
        {link.is_confirmed ?
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
        {link.is_public ?
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
          {!link.is_primary ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
            <i className="fa fa-star"></i>
            </button> :
            null
          }
          {link.is_public ?
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
              <i className="fa fa-shield"></i>
            </button> :
            <button
              type="button"
              className="btn btn-secondary btn-sm"
            >
            <i className="fa fa-exchange"></i>
            </button>
          }
          {!link.is_primary ?
            <button
              type="button"
              className="btn btn-danger"
              aria-label="Delete"
            >
              <i className="fa fa-trash"></i>
            </button> :
            null
          }
        </span>
      </li>
    );
  };

  export default Link;