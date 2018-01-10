import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const Link = ({ link, onMakePrimary, onMakePrivate, onMakePublic, onConfirm, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {link.type} : {link.url}

      <span>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onDelete}
        >
          <i
            className="fa fa-trash"
            data-toggle="tooltip"
            data-placement="top"
            title={intl.formatMessage({
              id: "delete",
              defaultMessage: "Delete"
            })}
          >
          </i>
        </button>
      </span>
    </li>
  );
};

export default Link;