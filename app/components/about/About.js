import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const About = ({ about, onMakePrimary }) => {
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
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onMakePrimary}
        >
          <i className="fa fa-star"></i>
          <FormattedMessage
            id="makeitprimary"
            defaultMessage="Make it primary"
          />
        </button>
      }
    </li>
  );
};

export default About;