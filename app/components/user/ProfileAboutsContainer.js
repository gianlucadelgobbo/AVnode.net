import { connect } from 'preact-redux';

import {   
    aboutUserMakePrimary,
    editUserAbouts 
} from '../../reducers/actions';
import ProfileAbouts from './ProfileAbouts';

const mapStateToProps = ({user}) => ({
    user: user
});

const mapDispatchToProps = (dispatch) => ({
    aboutUserMakePrimary: dispatch(aboutUserMakePrimary),
    saveProfile: dispatch(editUserAbouts)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileAbouts);
