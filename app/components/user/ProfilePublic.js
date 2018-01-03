import { h } from 'preact';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
//import validate from './validate';
// import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Abouts from '../about/Abouts';
import Links from '../link/Links';
import LinksSocial from '../link/LinksSocial';
import AddressesPublic from '../place/AddressesPublic';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;
import { connect } from 'preact-redux';
import {
  fetchCountries,
  editUser
} from '../../reducers/actions';

let ProfilePublicForm = props => {
  const {
    user,
    /*submitting,
    dirty,
    invalid,
    pristine,
    valid,*/
    intl,
    handleSubmit,
    editUser,
    fetchCountries
  } = props;

  if (!user._countries) {
    fetchCountries();
  }

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
          <h3>
            <FormattedMessage
              id="myAccountPublicData"
              defaultMessage="My Account Public data"
            />
          </h3>

            <div className="form-group">
              <label htmlFor="stagename">
                <FormattedMessage
                  id="stagename"
                  defaultMessage="Stage name"
                />
              </label>
              <Field
                className="form-control"
                name="stagename"
                component="input"
                value={user.stagename}
              />
            </div>
            <div className="form-group">
              <label htmlFor="slug">
                <FormattedMessage
                  id="slug"
                  defaultMessage="Profile url"
                />
              </label>
              <div className="input-group">
                <Field
                  className="form-control"
                  name="slug"
                  component="input"
                  value={user.slug}
                />
              </div>
              <p>
                {user.publicUrl}
              </p>
              <p>
                <FormattedMessage
                  id="url.change.disclaimer"
                  defaultMessage="Changing your url can have unintended side effects!"
                />
              </p>
            </div>

          { /* abouts start */}
          <FieldArray name="abouts" component={Abouts} />
          { /* abouts end */}

          { /* links start */}
          <FieldArray name="links" component={Links} />
          { /* links end */}

          { /* linksSocial start */}
          <FieldArray name="linksSocial" component={LinksSocial} />
          { /* linksSocial end */}

          { /* Addresses start */}
          <FieldArray name="addresses" component={AddressesPublic} />
          { /* Addresses end */}
          <label>
            <FormattedMessage
              id="editAddressInPrivateSection"
              defaultMessage="Edit addresses in private section, only the locality and country are displayed publicly"
            />
          </label>
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

ProfilePublicForm = injectIntl(reduxForm({
  form: 'userPublic',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  //validate
})(ProfilePublicForm));

const ProfilePublic = props => {
  console.log('ProfilePublic props');
  const onSubmit = (props, dispatch) => {
    console.log('ProfilePublic onSubmit dispatch' + dispatch);
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
    console.log('ProfilePublic onSubmitSuccess');
  };
  return (
    <ProfilePublicForm
      initialValues={props.user}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('--> ProfilePublic state.user: ' + JSON.stringify(state.user._id));
  console.log('--> ProfilePublic state.user.slug: ' + JSON.stringify(state.user.slug));
  console.log('--> ProfilePublic state.user.stagename: ' + JSON.stringify(state.user.stagename));
  console.log('--> ProfilePublic state.user.name: ' + JSON.stringify(state.user.name));
  return {
    user: state.user,
    initialValues: state.user//, 
    //submitting: submitting
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
