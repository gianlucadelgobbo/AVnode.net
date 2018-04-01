import { connect } from 'preact-redux';
import Venue from './Venue';

import { addEventVenue, removeEventVenue } from '../../reducers/actions';

const mapStateToProps = ({user}) => {
  return {
    user: user,
    initialValues: user
  };
};

const mapDispatchToProps = (dispatch) => ({
  complete: dispatch(addEventVenue),
  delete: dispatch(removeEventVenue)
});

export default connect(mapStateToProps, mapDispatchToProps)(Venue);
