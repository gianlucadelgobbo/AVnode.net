import { connect } from 'preact-redux';
import Place from './Place';

import { addPlace, removePlace } from '../reducers/actions';

const mapStateToProps = ({user}) => {
  return {
    user: user
  }
};

const mapDispatchToProps = (dispatch) => ({
  complete: dispatch(addPlace),
  delete: dispatch(removePlace)
});

export default connect(mapStateToProps, mapDispatchToProps)(Place);
