import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import CrewNav from './CrewNav';
import Match from 'preact-router/match';

const CrewPublicContainer = injectIntl(() => {
  return (
    <div>
          <div className="container-fluid">
      <Match>
        {({ url }) => <CrewNav url={url} />}
      </Match>
    </div>
        <label>
        CrewPublicContainer
        </label>
    </div>
  );
});

export default CrewPublicContainer;