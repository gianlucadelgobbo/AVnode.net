import { h } from 'preact';
import { connect } from 'preact-redux';

import { deleteCrew } from '../../reducers/actions';

const CrewShow = ({crew, dispatch}) => {
  return (
    <li className="list-group-item justify-content-between">
      {crew.name}
      <span>
        { crew.ajaxInProgress === true ?
          <button className="btn btn-secondary disabled">
            <i className="fa fa-fw fa-spinner fa-pulse"></i>
          </button> :
          <button className="btn btn-danger"
            onClick={() => { dispatch(deleteCrew(crew._id)); }}>
            <i className="fa fa-fw fa-trash"></i>
          </button>
        }
        <a className="btn btn-secondary" href={'/account/crews/' + crew._id}><i className="fa fa-edit"></i></a>
      </span>
    </li>
  );
};

export default connect()(CrewShow);
