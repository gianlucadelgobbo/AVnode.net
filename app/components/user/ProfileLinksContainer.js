import { connect } from 'preact-redux';

import { 
  userLinkMakePrimary,
  userLinkMakePrivate,
  userLinkMakePublic,
  userLinkConfirm,
  userLinkDelete,
  editUserLinks
} from '../../reducers/actions';
import ProfileLinks from './ProfileLinks';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  userLinkMakePrimary: dispatch(userLinkMakePrimary),
  userLinkMakePrivate: dispatch(userLinkMakePrivate),
  userLinkMakePublic: dispatch(userLinkMakePublic),
  userLinkConfirm: dispatch(userLinkConfirm),
  userLinkDelete: dispatch(userLinkDelete),
  saveProfile: dispatch(editUserLinks)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLinks);
