import { h } from 'preact';
import { connect } from 'preact-redux';
import { injectIntl, FormattedMessage } from 'preact-intl';
import PerformanceNav from './PerformanceNav';
import Match from 'preact-router/match';

const PerformancePhotoGalleryContainer = injectIntl(() => {
  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <PerformanceNav url={url} />}
        </Match>
      </div>
      <label>
        PerformancePhotoGalleryContainer
        </label>
    </div>
  );
});

export default PerformancePhotoGalleryContainer;