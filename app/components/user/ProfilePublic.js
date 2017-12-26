import { h } from 'preact';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
//import validate from './validate';
// import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Abouts from '../about/Abouts';
import Links from '../link/Links';
import LinksWeb from '../link/LinksWeb';
import LinksSocial from '../link/LinksSocial';
import AddressesPublic from '../place/AddressesPublic';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;
import { connect } from 'preact-redux';
import {
  fetchCountries,
  userLinkAdd,
  userLinkDelete,
  userAboutDelete,
  userAddressDelete,  
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
    linkDelete,
    addressDelete,
    fetchCountries
  } = props;
  if (!props.dispatch) console.log('ProfilePublicForm, ERROR dispatch undefined');

  if (!user) {
    console.log('ProfilePublicForm ERROR user not defined');
  }
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
          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="myAccountPublicData"
                defaultMessage="My Account Public data"
              />
            </legend>

          </fieldset>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="details"
                defaultMessage="Details"
              />
            </legend>

            <label htmlFor="stagename">
              <FormattedMessage
                id="stagename"
                defaultMessage="stagename"
              />
            </label>
            <Field
              className="form-control"
              name="stagename"
              component="input"
              value={user.stagename}
            />
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
          </fieldset>
          { /* abouts start */}
          <FieldArray name="abouts" component={Abouts} />
          { /* abouts end */}

          { /* links start */}
          <FieldArray name="links" component={Links} />
          { /* links end */}

          { /* <LinksWeb
            current={user}
            intl={intl}
            linkDelete={linkDelete}
          />
          <LinksSocial
            current={user}
            intl={intl}
            linkDelete={linkDelete}
          />
          <AddressesPublic
            current={user}
            user={user}
            intl={intl}
            addressDelete={addressDelete}
          /> */}
          { /* Addresses start */}
          <FieldArray name="addresses" component={AddressesPublic} />
          { /* Addresses end */}

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
      initialValues={props.event}
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
  linkAdd: dispatch(userLinkAdd),
  linkDelete: dispatch(userLinkDelete),
  aboutDelete: dispatch(userAboutDelete),
  addressDelete: dispatch(userAddressDelete),
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
