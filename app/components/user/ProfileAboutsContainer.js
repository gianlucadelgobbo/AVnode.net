import { connect } from 'preact-redux';

import {   
    aboutUserMakePrimary,
    aboutUserDelete,
    editUserAbouts 
} from '../../reducers/actions';
import ProfileAbouts from './ProfileAbouts';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    aboutUserMakePrimary: dispatch(aboutUserMakePrimary),
    aboutUserDelete: dispatch(aboutUserDelete),
    saveProfile: dispatch(editUserAbouts)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAbouts);
