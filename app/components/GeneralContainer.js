import { connect } from 'preact-redux';
import {
  openStagenameModal,
  closeStagenameModal,
  openPasswordModal,
  closePasswordModal,
  addUserProfileImage,
  addUserTeaserImage,
  fetchLinkTypes,
  fetchLanguages,
  fetchCountries,
  editUser,
} from '../reducers/actions';
import General from './General';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  openStagenameModal: dispatch(openStagenameModal),
  closeStagenameModal: dispatch(closeStagenameModal),
  openPasswordModal: dispatch(openPasswordModal),
  closePasswordModal: dispatch(closePasswordModal),
  addUserProfileImage: dispatch(addUserProfileImage),
  addUserTeaserImage: dispatch(addUserTeaserImage),
  saveProfile: dispatch(editUser),
  fetchLinkTypes: dispatch(fetchLinkTypes),
  fetchLanguages: dispatch(fetchLanguages),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
