import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import PerformanceNav from './PerformanceNav';
import Match from 'preact-router/match';

const PerformanceSettingsContainer = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <PerformanceNav url={url} />}
        </Match>
      </div>
      <label>
        PerformanceSettingsContainer
      </label>
    </div>
  );
});

export default PerformanceSettingsContainer;
