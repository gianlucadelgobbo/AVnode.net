import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { deleteCrew } from '../../reducers/actions';

const CrewShow = ({ crew, dispatch }) => {
  return (
    <li className="list-group-item justify-content-between">
      {crew.file ?
        <img
          className="img-small mb-3"
          src={`${crew.squareThumbnailUrl}`}
          alt={`image of ${crew.stagename}`}
        />
        :
        null}
      {crew.stagename} ({crew.slug})
      <span>
        {crew.ajaxInProgress === true ?
          <button className="btn btn-secondary disabled">
            <i className="fa fa-fw fa-spinner fa-pulse"></i>
          </button> :
          <button className="btn btn-danger"
            onClick={() => { dispatch(deleteCrew(crew._id)); }}>
            <i className="fa fa-fw fa-trash"></i>
          </button>
        }
        <button className="btn btn-info"
          onClick={() => { route('/admin/crew/public/' + crew._id); }}>
          <i className="fa fa-fw fa-edit"></i>
        </button>
      </span>
    </li>
  );
};

export default connect()(CrewShow);
