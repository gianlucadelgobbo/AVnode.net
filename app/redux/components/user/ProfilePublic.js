import { h } from 'preact';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Abouts from '../about/Abouts';
import ProfileAbouts from './ProfileAbouts';
import Links from '../link/Links';
import LinksSocial from '../link/LinksSocial';
import AddressesPublic from '../place/AddressesPublic';
import Match from 'preact-router/match';
import Languages from '../language/Languages';
import { connect } from 'preact-redux';
import renderLabel from '../renderLabel';
import renderField from '../renderField';
import Modal from '../Modal';
import ProfileLinksWeb from './ProfileLinksWeb';

import {
  fetchCountries,
  editUser,
  userLinkDelete,
  userAboutDelete
} from '../../reducers/actions';

const required = value => value ? undefined : 'Required'
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15);


let ProfilePublicForm = props => {
  const {
    user,
    abouts,
    handleSubmit,
    editUser,
    fetchCountries,
    userAboutDelete,
    intl,
    userLinkDelete
  } = props;


  let selectedLanguage = 0;
  const onSwitchLanguage = (e) => {
    e.preventDefault();
    selectedLanguage = e.target.__preactattr_.href;
    console.log('selectedLanguage:' + selectedLanguage);
  };
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
          <Field
            name="errorMessage"
            component={renderLabel}
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
              component= {renderField}
              validate={[ required ]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="slug">
              <FormattedMessage
                id="slug"
                defaultMessage="Profile url"
              />
            </label>          
            <Field
              className="form-control"
              name="slug"
              component= {renderField}
              validate={[ required ]}
            />
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

          <ProfileAbouts
            user={user}
            intl={intl}
            userAboutDelete={userAboutDelete}
          />
          
          {console.log('sl:' + selectedLanguage)}
          { /* abouts start */}
          <FieldArray
            name="abouts"
            component={Abouts}
            props={{
              selectedLanguage: selectedLanguage,
              onSwitchLanguage: onSwitchLanguage
            }}
          />
          { /* abouts end */}

          { /* links start */}
          <FieldArray name="links" component={Links} />
          { /* links end */}

          { /* linksSocial start */}
          <FieldArray name="linksSocial" component={LinksSocial} />
          { /* linksSocial end */}

          <ProfileLinksWeb
            user={user}
            intl={intl}
            userLinkDelete={userLinkDelete}
          />

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
const selector = formValueSelector('userPublic');
const ProfilePublic = props => {
  //console.log('ProfilePublic props');
  const onSubmit = (props, dispatch) => {
    console.log('ProfilePublic onSubmit dispatch' + dispatch);
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
    console.log('ProfilePublic onSubmitSuccess');
    alert("Form Saved");
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
  // add other languages abouts
  /*
  let abouts = selector(state, 'abouts');
  if (abouts && abouts.length < Languages.length) {
    for (let l = 0; l < Languages.length; l++) {
      let found = false;
      for (let a = 0; a < abouts.length; a++) {
        if (abouts[a].lang == Languages[l].code) {
          console.log(abouts[a].lang);
          found = true;
        }
      }
      if (!found) {
        abouts.push({ 'lang': Languages[l].code, 'abouttext': '', 'index': Languages[l].index });
      }
    }
    console.log(JSON.stringify(abouts));
  }*/
  // console.log(props.selectedLanguage);
  return {
    user: state.user,
    initialValues: state.user,
    //abouts
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries),
  userLinkDelete: dispatch(userLinkDelete),
  userAboutDelete: dispatch(userAboutDelete)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);
