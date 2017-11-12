import { connect } from 'preact-redux';

import {   
    userAboutEdit,
    userAboutDelete,
    editUserAbouts 
} from '../../reducers/actions';
import ProfileAbouts from './ProfileAbouts';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    userAboutEdit: dispatch(userAboutEdit),
    userAboutDelete: dispatch(userAboutDelete),
    saveProfile: dispatch(editUserAbouts)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAbouts);
