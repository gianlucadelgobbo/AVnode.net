import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const About = ({ about, onMakePrimary, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {about.lang} : {about.abouttext}
      {about.is_primary ?
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
                id: "makeitprimary",
                defaultMessage: "Make it primary"
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
                id: "delete",
                defaultMessage: "Delete"
              })}
            >
            </i>
          </button>
        </span>
      }
    </li>
  );
};

export default About;