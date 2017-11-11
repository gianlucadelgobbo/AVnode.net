import { connect } from 'preact-redux';

import {   
    emailUserMakePrimary,
    editUserEmails 
} from '../../reducers/actions';
import ProfileEmails from './ProfileEmails';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    emailUserMakePrimary: dispatch(emailUserMakePrimary),
    saveProfile: dispatch(editUserEmails)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEmails);
