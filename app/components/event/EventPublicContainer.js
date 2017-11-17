import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';

const EventPublicContainer = injectIntl(() => {
  return (
    <div>
        <label>
        EventPublicContainer
        </label>
    </div>
  );
});

export default EventPublicContainer;