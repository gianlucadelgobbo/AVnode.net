import { connect } from 'preact-redux';
import Place from './Place';

import { addPlace } from '../../reducers/actions';

const mapStateToProps = ({user}) => {
  return {
    user: user,
    initialValues: user
  };
};

const mapDispatchToProps = (dispatch) => ({
  complete: dispatch(addPlace)
});

export default connect(mapStateToProps, mapDispatchToProps)(Place);
