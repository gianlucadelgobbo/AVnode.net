import { h } from 'preact';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Connections from './Connections';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;
import { connect } from 'preact-redux';
import {
  editUser
} from '../../reducers/actions';

let ProfileConnectionsForm = props => {
  const { 
    user,
    intl,
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
          <Field
            name="_id"
            component="input"
            type="hidden"
          />
          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="connections"
                defaultMessage="Connections"
              />
            </legend>
          </fieldset>
          { /* connections start */}
          <FieldArray name="connections" component={Connections} />
          { /* connections end */}

          <div className="form-group">
            <button
              className="btn btn-primary"
              // disabled={submitting}
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

ProfileConnectionsForm = injectIntl(reduxForm({
  form: 'userConnections',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  //validate
})(ProfileConnectionsForm));

const ProfileConnections = props => {
  console.log('ProfileConnections props');
  const onSubmit = (props, dispatch) => {
    console.log('ProfileConnections onSubmit dispatch' + dispatch);
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
    console.log('ProfileConnections onSubmitSuccess');
  };
  return (
    <ProfileConnectionsForm
      initialValues={props.event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('--> ProfileConnections state.user: ' + JSON.stringify(state.user._id));
  console.log('--> ProfileConnections state.user.slug: ' + JSON.stringify(state.user.slug));
  console.log('--> ProfileConnections state.user.stagename: ' + JSON.stringify(state.user.stagename));
  console.log('--> ProfileConnections state.user.name: ' + JSON.stringify(state.user.name));
  return {  
    user: state.user,
    initialValues: state.user//, 
  //submitting: submitting
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnections);
