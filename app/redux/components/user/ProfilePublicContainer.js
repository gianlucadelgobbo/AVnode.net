import { connect } from 'preact-redux';
import {
  fetchCountries,
  userLinkAdd,
  userLinkDelete,
  editUserAbouts,
  userAboutEdit,
  userAboutDelete,
  userAddressDelete,
  openEdituserModal,
  closeEdituserModal,
  editUser
} from '../../reducers/actions';
import ProfilePublic from './ProfilePublic';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  userLinkAdd: dispatch(userLinkAdd),
  editUserAbouts: dispatch(editUserAbouts),
  userAboutEdit: dispatch(userAboutEdit),
  userAddressDelete: dispatch(userAddressDelete),
  saveProfile: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries),
  openEdituserModal:dispatch(openEdituserModal),
  closeEdituserModal:dispatch(closeEdituserModal)
  
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
