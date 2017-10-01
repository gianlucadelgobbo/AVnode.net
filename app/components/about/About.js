import React, { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';

const About = ({ about }) => {
    return (
      <li className="list-group-item justify-content-between">
        {about.lang} : {about.abouttext}
      </li>
    );
  };

  export default About;