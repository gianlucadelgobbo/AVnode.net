import { h } from 'preact';
import { connect } from 'preact-redux';

import { deletePerformance } from '../../reducers/actions';

const PerformanceShow = ({performance, dispatch}) => {
  return (
    <li className="list-group-item justify-content-between">
      {performance.title}
      <span>
        { performance.ajaxInProgress === true ?
          <button className="btn btn-secondary disabled">
            <i className="fa fa-fw fa-spinner fa-pulse"></i>
          </button> :
          <button className="btn btn-secondary"
            onClick={() => { dispatch(deletePerformance(performance._id)); }}>
            <i className="fa fa-fw fa-trash"></i>
          </button>
        }
        <a className="btn btn-secondary" href={'/account/performances/' + performance._id} data-toggle="tooltip" data-placement="top" title="Edit performance"><i className="fa fa-edit"></i></a>
        <a className="btn btn-secondary" href={'/account/performanceabouts/' + performance._id} data-toggle="tooltip" data-placement="top" title="Edit about section"><i className="fa fa-question"></i></a>
        </span>
    </li>
  );
};

export default connect()(PerformanceShow);
