import { connect } from 'preact-redux';
import {
  editCrew,
  aboutCrewMakePrimary
} from '../../reducers/actions';
import CrewPublic from './CrewPublic';

const mapStateToProps = (state, props) => {
  return {
    crew: (state.user.crews.find(c => { return c._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  saveCrew: dispatch(editCrew),
  aboutCrewMakePrimary: dispatch(aboutCrewMakePrimary)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewPublic);
