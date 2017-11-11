import { connect } from 'preact-redux';

import { editUserLinks } from '../../reducers/actions';
import ProfileLinks from './ProfileLinks';

const mapStateToProps = ({user}) => ({
    user: user,
    initialValues: user
});

const mapDispatchToProps = (dispatch) => ({
    saveProfile: dispatch(editUserLinks)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileLinks);
