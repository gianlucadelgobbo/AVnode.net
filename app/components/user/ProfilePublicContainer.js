import { connect } from 'preact-redux';
import {
  fetchCountries,
  userLinkAdd,
  userLinkDelete,
  //editUserAbouts,
  //userAboutEdit,
  userAboutDelete,
  userAddressDelete,  
  editUser
} from '../../reducers/actions';
import ProfilePublic from './ProfilePublic';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user//, 
  //submitting: submitting
});

const mapDispatchToProps = (dispatch) => ({
  linkAdd: dispatch(userLinkAdd),
  linkDelete: dispatch(userLinkDelete),
  //editUserAbouts: dispatch(editUserAbouts),
  //userAboutEdit: dispatch(userAboutEdit),
  aboutDelete: dispatch(userAboutDelete),
  userAddressDelete: dispatch(userAddressDelete),
  saveProfile: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
