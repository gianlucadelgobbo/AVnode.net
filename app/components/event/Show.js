import { h } from 'preact';
import { connect } from 'preact-redux';

import { deleteEvent } from '../../reducers/actions';

const EventShow = ({event, dispatch}) => {
  return (
    <li className="list-group-item justify-content-between">
      {event.title} ({event.slug})
      <span>
        { event.ajaxInProgress === true ?
          <button className="btn btn-secondary disabled">
            <i className="fa fa-fw fa-spinner fa-pulse"></i>
          </button> :
          <button className="btn btn-secondary"
            onClick={() => { dispatch(deleteEvent(event._id)); }}>
            <i className="fa fa-fw fa-trash"></i>
          </button>
        }
        <a className="btn btn-secondary" href={'/account/event/public/' + event._id}><i className="fa fa-edit"></i></a>
      </span>
    </li>
  );
};

export default connect()(EventShow);
