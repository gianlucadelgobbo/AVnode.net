import { h } from 'preact';

const LinkWeb = ({ linkWeb, onEdit, onDelete, intl }) => {

  return (
    <li className="list-group-item justify-content-between">
      {linkWeb.type} : <a href={`${linkWeb.url}`} target="_blank">{linkWeb.url}</a>
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
        {/*{ linkWeb.is_primary ?
          <span className="badge badge-primary">
          <FormattedMessage
            id="primary"
            defaultMessage="Primary"
          />
        </span> :
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
                id: "makeitprimary",
                defaultMessage: "Make it primary"
              })}
            >
            </i>
          </button>*/}
        <button className="btn btn-success btn-sm"
          onClick={onEdit}>
          <i
            className="fa fa-fw fa-edit"
            data-toggle="tooltip"
            data-placement="top"
            title={intl.formatMessage({
              id: "edit",
              defaultMessage: "Edit"
            })}
          >
          </i>
        </button>
      </span>
    </li>
  );
};

export default LinkWeb;