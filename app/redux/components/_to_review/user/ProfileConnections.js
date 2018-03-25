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
  const onSubmit = (props, dispatch) => {
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
  };
  return (
    <ProfileConnectionsForm
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
    initialValues: state.user//, 
  //submitting: submitting
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileConnections);
