import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const Address = ({ address, onMakePrimary, onMakePrivate, onMakePublic, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {address.locality} : {address.formatted_address}
      {address.is_public ?
        <span className="badge badge-success">
          <FormattedMessage
            id="public"
            defaultMessage="Public"
          />
        </span>
        :
        <span className="badge badge-warning">
          <FormattedMessage
            id="private"
            defaultMessage="Private"
          />
        </span>
      }
      {address.is_public ?
        <span className="badge badge-success">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onMakePrivate}
          >
            <i
              className="fa fa-shield"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: 'makeitprivate',
                defaultMessage: 'Make it private'
              })}
            >
            </i>
          </button>
        </span> :
        <span className="badge badge-warning">
          <button
            type="button"
            className="btn btn-warning btn-sm"
            onClick={onMakePublic}
          >
            <i
              className="fa fa-exchange"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: 'makeitpublic',
                defaultMessage: 'Make it public'
              })}
            >
            </i>
          </button>
        </span>
      }
      {address.is_primary ?
        <span className="badge badge-primary">
          <FormattedMessage
            id="primary"
            defaultMessage="Primary"
          />
        </span> :
        <span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onMakePrimary}
          >
            <i
              className="fa fa-star"
              data-toggle="tooltip"
              data-placement="top"
              title={intl.formatMessage({
                id: 'makeitprimary',
                defaultMessage: 'Make it primary'
              })}
            >
            </i>
          </button>
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
                id: 'delete',
                defaultMessage: 'Delete'
              })}
            >
            </i>
          </button>
        </span>
      }

    </li>
  );
};

export default Address;