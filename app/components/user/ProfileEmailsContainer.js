import { connect } from 'preact-redux';

import {   
    userEmailMakePrimary,
    userEmailMakePrivate,
    userEmailMakePublic,
    userEmailConfirm,
    userEmailDelete,
    editUserEmails 
} from '../../reducers/actions';
import ProfileEmails from './ProfileEmails';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    userEmailMakePrimary: dispatch(userEmailMakePrimary),
    userEmailMakePrivate: dispatch(userEmailMakePrivate),
    userEmailMakePublic: dispatch(userEmailMakePublic),
    userEmailConfirm: dispatch(userEmailConfirm),
    userEmailDelete: dispatch(userEmailDelete),    saveProfile: dispatch(editUserEmails)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEmails);
