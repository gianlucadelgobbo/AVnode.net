import { connect } from 'preact-redux';

import { 
  addUserProfileImage,
  addUserTeaserImage,
  editUserImages 
} from '../../reducers/actions';
import ProfileImages from './ProfileImages';

const mapStateToProps = ({user}) => ({
  user: user
});

const mapDispatchToProps = (dispatch) => ({
  addUserProfileImage: dispatch(addUserProfileImage),
  addUserTeaserImage: dispatch(addUserTeaserImage),
  saveProfile: dispatch(editUserImages)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImages);
