import { h } from 'preact';
import { connect } from 'preact-redux';

import Layout from './Layout';
import EventAdd from './event/Add';
import EventShow from './event/Show';
import { injectIntl } from 'preact-intl';

const Events = ({ events, ajaxInProgress, intl })  => {
  return (
    <Layout>
      <EventAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {events.map((event) =>
          <EventShow event={event} />
        )}
      </ul>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.user.events,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(injectIntl(Events));
