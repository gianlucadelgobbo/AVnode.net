import { connect } from 'preact-redux';

import {   
    userAddressMakePrimary,
    userAddressMakePrivate,
    userAddressMakePublic,
    userAddressDelete,
    editUserAddresses 
} from '../../reducers/actions';
import ProfileAddresses from './ProfileAddresses';

const mapStateToProps = ({user}) => ({
  user: user,
  initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
  userAddressMakePrimary: dispatch(userAddressMakePrimary),
  userAddressMakePrivate: dispatch(userAddressMakePrivate),
  userAddressMakePublic: dispatch(userAddressMakePublic),
  userAddressDelete: dispatch(userAddressDelete),
  saveProfile: dispatch(editUserAddresses)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddresses);
