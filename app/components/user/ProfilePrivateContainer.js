import { connect } from 'preact-redux';

import {   
  fetchCountries,
  userLinkDelete,
  userLinkEdit,
  editUser
} from '../../reducers/actions';
import ProfilePrivate from './ProfilePrivate';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  userLinkDelete: dispatch(userLinkDelete),
  userLinkEdit: dispatch(userLinkEdit),
  saveProfile: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePrivate);
