import { h } from 'preact';
import { connect } from 'preact-redux';

import Layout from './Layout';
import PerformanceAdd from './performance/Add';
import PerformanceShow from './performance/Show';
import { injectIntl } from 'preact-intl';

const Performances = ({ performances, ajaxInProgress, intl }) => {
  return (
    <Layout>
      <PerformanceAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {performances.map((performance) =>
          <PerformanceShow performance={performance} />
        )}
      </ul>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    performances: state.user.performances,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(injectIntl(Performances));
