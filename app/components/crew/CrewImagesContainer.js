import { connect } from 'preact-redux';

import { 
  addCrewProfileImage,
  addCrewTeaserImage,
  editCrewImages 
} from '../../reducers/actions';
import CrewImages from './CrewImages';

const mapStateToProps = ({crew}) => ({
  crew: crew,
  initialValues: crew
});

const mapDispatchToProps = (dispatch) => ({
  addCrewProfileImage: dispatch(addCrewProfileImage),
  addCrewTeaserImage: dispatch(addCrewTeaserImage),
  saveProfile: dispatch(editCrewImages)
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewImages);