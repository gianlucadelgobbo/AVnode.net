import { connect } from 'preact-redux';
import {
  fetchCountries,
  userLinkMakePrimary,
  userLinkDelete,
  //userAboutEdit,
  //userAboutDelete,
  editUser
} from '../../reducers/actions';
import ProfilePublic from './ProfilePublic';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user//, 
  //submitting: submitting
});

const mapDispatchToProps = (dispatch) => ({
  userLinkWebMakePrimary: dispatch(userLinkMakePrimary),
  userLinkWebDelete: dispatch(userLinkDelete),
  //userAboutEdit: dispatch(userAboutEdit),
  //userAboutDelete: dispatch(userAboutDelete),
  saveProfile: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
