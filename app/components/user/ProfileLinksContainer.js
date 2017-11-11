import { connect } from 'preact-redux';

import { 
    userLinkMakePrimary,
    userLinkDelete,
    editUserLinks
} from '../../reducers/actions';
import ProfileLinks from './ProfileLinks';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    userLinkMakePrimary: dispatch(userLinkMakePrimary),
    userLinkDelete: dispatch(userLinkDelete),
    saveProfile: dispatch(editUserLinks)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLinks);
