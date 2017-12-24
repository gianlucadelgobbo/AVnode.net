import { h } from 'preact';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';

const ProfileConnections = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <label>
      ProfileConnections
      </label>
    </div>
  );
});

export default ProfileConnections;