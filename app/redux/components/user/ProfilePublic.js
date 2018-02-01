import { h } from 'preact';
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import ProfileNav from './ProfileNav';
import Abouts from '../about/Abouts';
import LinksWeb from '../link/Links';
import LinksSocial from '../link/LinksSocial';
import AddressesPublic from '../place/AddressesPublic';
import Match from 'preact-router/match';
import Languages from '../language/Languages';
import { connect } from 'preact-redux';
import renderLabel from '../renderLabel';
import renderField from '../renderField';
import asyncValidate from '../asyncValidate';
import validate from './validate';
import ProfileLinksSocial from './ProfileLinksSocial';
import { Modal, Button } from 'react-bootstrap';

import {
  fetchCountries,
  editUser,
  userLinkDelete,
  userAboutDelete,
  openEdituserModal,
  closeEdituserModal
} from '../../reducers/actions';

<<<<<<< HEAD
const onSwitchLanguage = (e) => {
  e.preventDefault();
  selectedLanguage = e.target.__preactattr_.href;
  console.log('selectedLanguage:' + selectedLanguage);
};
const required = value => value ? undefined : 'Required'
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined
const maxLength15 = maxLength(15);
=======
>>>>>>> ac957a881f670a7a29fbae9cd4ac84d746b5975a

let ProfilePublicForm = props => {
  const {
    user,
    abouts,
    links,
    handleSubmit,
    openEdituserModal,
    closeEdituserModal,
    editUser,
    fetchCountries,
    userAboutDelete,
    intl,
    userLinkDelete,
    submitting
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

          <FieldArray
            name="abouts"
            component={Abouts}
          />

          <FieldArray 
            name="web" 
            component={LinksWeb} 
          />

          <FieldArray 
            name="social"
            component={LinksSocial} 
            props={{
              user: user,
              onSwitchLanguage: onSwitchLanguage
            }}
          />

          <FieldArray 
            name="addresses" 
            component={AddressesPublic} 
          />
          
          <label>
            <FormattedMessage
              id="editAddressInPrivateSection"
              defaultMessage="Edit addresses in private section, only the locality and country are displayed publicly"
            />
          </label>
          <div className="form-group">
            <button
              className="btn btn-primary"
              //onClick={openEdituserModal}
              disabled={submitting}
              type="submit"
            >
              <FormattedMessage
                id="form.save"
                defaultMessage="Save"
              />
            </button>
          </div>
        </form>
         <div className="static-modal">
          <Modal show={user._editUserActive} onHide={openEdituserModal}>
            <Modal.Header>
              <Modal.Title>Form Saved</Modal.Title>
              <button type="button" class="close" onClick={closeEdituserModal} aria-label="Close"><span aria-hidden="true">×</span></button>
            </Modal.Header>
            <Modal.Body><pre class="code-block"></pre></Modal.Body>
            <Modal.Footer>
              <Button onClick={closeEdituserModal}>Close</Button>
            </Modal.Footer>
          </Modal>
          </div>
      </Layout >
    </div>
  );
};

ProfilePublicForm = injectIntl(reduxForm({
  form: 'userPublic',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate,
  asyncValidate,
  asyncBlurFields: ['stagename'],
})(ProfilePublicForm));

const selector = formValueSelector('userPublic');
const ProfilePublic = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
    console.log('ProfilePublic onSubmitSuccess');
  };
 const showResults = (values) => {
  {openEdituserModal}
  //window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
};

  return (
    <ProfilePublicForm
      initialValues={props.user}
      onSubmit={onSubmit}
      onSubmitSuccess={showResults}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
    
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
  }

  return {
    user: state.user,
    initialValues: state.user,
    abouts
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries),
  userLinkDelete: dispatch(userLinkDelete),
  userAboutDelete: dispatch(userAboutDelete),
  openEdituserModal:dispatch(openEdituserModal),
  closeEdituserModal:dispatch(closeEdituserModal)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePublic);