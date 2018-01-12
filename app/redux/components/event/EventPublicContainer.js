import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import EventNav from './EventNav';
import Match from 'preact-router/match';

const EventPublicContainer = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <EventNav url={url} />}
        </Match>
      </div>
      <label>
        EventPublicContainer
        </label>
    </div>
  );
});

export default EventPublicContainer;