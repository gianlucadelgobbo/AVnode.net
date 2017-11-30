import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { deletePerformance } from '../../reducers/actions';

const PerformanceShow = ({ performance, dispatch }) => {
  return (
    <li className="list-group-item justify-content-between">
      {performance.file ?
        <img
          className="img-small mb-3"
          src={`${performance.imageUrl}`}
          alt={`image of ${performance.title}`}
        />
        :
        null}
      {performance.title}
      <span>
        {performance.ajaxInProgress === true ?
          <button className="btn btn-secondary disabled">
            <i className="fa fa-fw fa-spinner fa-pulse"></i>
          </button> :
          <button className="btn btn-danger"
            onClick={() => { dispatch(deletePerformance(performance._id)); }}>
            <i className="fa fa-fw fa-trash"></i>
          </button>
        }
        <button className="btn btn-info"
          onClick={() => { route('/account/performance/public/' + performance._id); }}>
          <i className="fa fa-fw fa-edit"></i>
        </button>
      </span>
    </li>
  );
};

export default connect()(PerformanceShow);
