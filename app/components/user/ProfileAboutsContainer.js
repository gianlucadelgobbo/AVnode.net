import { connect } from 'preact-redux';

import {   
    userAboutMakePrimary,
    userAboutDelete,
    editUserAbouts 
} from '../../reducers/actions';
import ProfileAbouts from './ProfileAbouts';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    userAboutMakePrimary: dispatch(userAboutMakePrimary),
    userAboutDelete: dispatch(userAboutDelete),
    saveProfile: dispatch(editUserAbouts)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAbouts);
