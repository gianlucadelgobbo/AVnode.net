import { h } from 'preact';
import { FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import { connect } from 'preact-redux';
import Emails from '../emails/Emails';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import validate from '../validate';
import Match from 'preact-router/match';
import {
  userEmailConfirm,
  userEmailTogglePrivacy,
  userEmailMakePrimary,
  editUser
} from '../../reducers/actions';

let ProfileEmailsForm = props => {
  const {
    user,
    intl,
    userEmailConfirm,
    userEmailTogglePrivacy,
    userEmailMakePrimary,
    dispatch,
    handleSubmit,
    editUser
  } = props;

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(editUser)}>
            <FieldArray name="emails" component={Emails} props={{
              onConfirm: props.userEmailConfirm,
              onMakePrimary: props.userEmailMakePrimary,
              onTogglePrivacy: props.userEmailTogglePrivacy,
              userId: props.user._id
            }} />

            <div className="form-group">
              <button
                className="btn btn-primary"
                type="submit"
              >
                <FormattedMessage
                  id="form.save"
                  defaultMessage="Save"
                />
              </button>
            </div>
        </form>
      </Layout >
    </div>
  );
};

ProfileEmailsForm = injectIntl(reduxForm({
  form: 'userEmails',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
})(ProfileEmailsForm));

const ProfileEmails = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
  };
  return (
    <ProfileEmailsForm
        initialValues={props.user}
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
        {...props}
      />
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    initialValues: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  userEmailConfirm: dispatch(userEmailConfirm),
  userEmailTogglePrivacy: dispatch(userEmailTogglePrivacy),
  userEmailMakePrimary: dispatch(userEmailMakePrimary),
  editUser: dispatch(editUser)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEmails);
