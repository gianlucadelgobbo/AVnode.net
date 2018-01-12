import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import EventNav from './EventNav';
import Match from 'preact-router/match';

const EventSettingsContainer = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <EventNav url={url} />}
        </Match>
      </div>
      <label>
        EventSettingsContainer
        </label>
    </div>
  );
});

export default EventSettingsContainer;