import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const About = ({ about, onEdit, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {about.lang} : {about.abouttext}
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

export default About;