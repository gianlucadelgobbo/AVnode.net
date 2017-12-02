import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import LinkSocial from '../link/LinkSocial';
import SocialLinkTypes from '../link/SocialLinkTypes';
import Layout from '../Layout';
import {
  userLinkDelete,
  //userLinkEdit,
  editUserLinks
} from '../../reducers/actions';

let ProfileLinksSocialForm = ({
  user,
  intl,
  handleSubmit,
  userLinkDelete,
  //userLinkEdit,
  saveProfile
  }) => {

  /*const onLinkEdit = (link) => (e) => {
    e.preventDefault();
    return userLinkEdit(user._id, link._id);
  };*/
  const onLinkDelete = (link) => (e) => {
    e.preventDefault();
    return userLinkDelete(user._id, link._id);
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit(saveProfile)}>
        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="socials"
              defaultMessage="Social channels"
            />
          </legend>

          <label htmlFor="linkSocial">
            <FormattedMessage
              id="url"
              defaultMessage="Url"
            />
          </label>
          
            <div className="input-group">
              <div className="input-group">
                <Field
                  className="form-control"
                  name="linkSocial"
                  component="input"
                  placeholder={intl.formatMessage({
                    id: 'link.placeholder',
                    defaultMessage: 'Add/edit url'
                  })}
                />
              </div>

              <div className="input-group-addon">

                {SocialLinkTypes ?
                  <Field
                    className="form-control custom-select"
                    name="linkType"
                    component="select"
                    value={user.linkType}
                  >
                    {SocialLinkTypes.map((c) => (
                      <option value={c.key.toLowerCase()}>{c.name}</option>
                    ))
                    }
                  </Field> :
                  <p>Loading a link types…</p>
                }
              </div>
              <div className="input-group-addon">
                <button
                  className="btn btn-success btn-sm"
                  type="submit"
                >
                  <i className="fa fa-link"></i>
                </button>
              </div>
            </div>
         
          <label>
            <FormattedMessage
              id="manageLinksSocial"
              defaultMessage="Manage your Social Links"
            />
          </label>
          <ul className="list-group mt-2">
            {
              user && user.links && user.links.map((l) => (
                l.type === 'tw' || l.type === 'fb' || l.type === 'ot' ?
                  <LinkSocial
                    linkSocial={l}
                    //onMakePrimary={onLinkSocialMakePrimary(l)}
                    //onEdit={onLinkEdit(l)}
                    onDelete={onLinkDelete(l)}
                    intl={intl}
                  />
                  :
                  null
              ))
            }
          </ul>
        </fieldset>
      </form>
    </Layout >
  );
};

ProfileLinksSocialForm = injectIntl(reduxForm({
  form: 'userLinksSocial',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ProfileLinksSocialForm));

const EditLinksSocial = props => {
  const onSubmit = (props, dispatch) => {
    //dispatch(editUserLinks(props));
  };
  const onSubmitSuccess = () => {
    //route('/account/...');
  };
  return (
    <ProfileLinksSocialForm
      initialValues={props.user}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  userLinkDelete: dispatch(userLinkDelete),
  //userLinkEdit: dispatch(userLinkEdit),
  saveProfile: dispatch(editUserLinks)
});

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    initialValues: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditLinksSocial);