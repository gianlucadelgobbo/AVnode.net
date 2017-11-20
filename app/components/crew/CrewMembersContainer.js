import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';

const CrewMembersContainer = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <CrewNav url={url} />}
        </Match>
      </div>
      <label>
        CrewMembersContainer
        </label>
    </div>
  );
});

export default CrewMembersContainer;