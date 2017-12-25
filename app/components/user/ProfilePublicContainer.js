import { connect } from 'preact-redux';
import {
  fetchCountries,
  userLinkAdd,
  userLinkDelete,
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
  aboutDelete: dispatch(userAboutDelete),
  addressDelete: dispatch(userAddressDelete),
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
