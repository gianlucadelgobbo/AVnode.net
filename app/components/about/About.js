import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const About = ({ about }) => {
    return (
      <li className="list-group-item justify-content-between">
        {about.lang} : {about.abouttext}
        {about.is_primary ?
          <span className="badge badge-primary">
            <FormattedMessage
              id="user.edit.form.label.about.badge.primary"
              defaultMessage="Primary"
            />
          </span> :
          null
        }
      </li>
    );
  };

  export default About;