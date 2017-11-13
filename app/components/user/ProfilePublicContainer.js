import { connect } from 'preact-redux';
import {
  openStagenameModal,
  closeStagenameModal,
  openPasswordModal,
  closePasswordModal,
  fetchCountries,
  //userAboutEdit,
  //userAboutDelete,
  editUser
} from '../../reducers/actions';
import ProfilePublic from './ProfilePublic';

const mapStateToProps = ({user, submitting}) => ({
  user: user,
  initialValues: user, 
  submitting: submitting
});

const mapDispatchToProps = (dispatch) => ({
  openStagenameModal: dispatch(openStagenameModal),
  closeStagenameModal: dispatch(closeStagenameModal),
  openPasswordModal: dispatch(openPasswordModal),
  closePasswordModal: dispatch(closePasswordModal),
  //userAboutEdit: dispatch(userAboutEdit),
  //userAboutDelete: dispatch(userAboutDelete),
  saveProfile: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
