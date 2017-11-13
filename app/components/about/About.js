import { h } from 'preact';
import { FormattedMessage } from 'preact-intl';

const About = ({ about, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      {about.lang} : {about.abouttext}
    </li>
  );
};

export default About;