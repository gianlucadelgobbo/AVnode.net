import { connect } from 'preact-redux';

import { 
  addUserProfileImage,
  addUserTeaserImage,
  editUserImages 
} from '../../reducers/actions';
import ProfilePassword from './ProfilePassword';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  addUserProfileImage: dispatch(addUserProfileImage),
  addUserTeaserImage: dispatch(addUserTeaserImage),
  saveProfile: dispatch(editUserImages)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePassword);
