import { connect } from 'preact-redux';

import {   
    addressUserMakePrimary,
    editUserAddresses 
} from '../../reducers/actions';
import ProfileAddresses from './ProfileAddresses';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    addressUserMakePrimary: dispatch(addressUserMakePrimary),
    saveProfile: dispatch(editUserAddresses)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAddresses);
