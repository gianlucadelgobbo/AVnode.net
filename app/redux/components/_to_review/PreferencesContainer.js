import { connect } from 'preact-redux';
import Preferences from './Preferences';
import { changeLanguage } from '../../reducers/actions';

const mapStateToProps = ({user}) => {
  return {
    user: user,
    initialValues: user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguage: dispatch(changeLanguage)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
