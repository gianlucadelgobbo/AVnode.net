import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import LinkWeb from '../link/LinkWeb';
import Layout from '../Layout';
import {
  userLinkDelete,
  //userLinkEdit,
  editUserLinks
} from '../../reducers/actions';

let ProfileLinksWebForm = ({
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
              id="websites"
              defaultMessage="Websites"
            />
          </legend>

          <label htmlFor="linkWeb">
            <FormattedMessage
              id="websiteUrl"
              defaultMessage="Website Url"
            />
          </label>
          <div className="input-group">
            <Field
              className="form-control"
              name="linkWeb"
              component="input"
              placeholder={intl.formatMessage({
                id: 'addUrl',
                defaultMessage: 'Add/edit url'
              })}
            />

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
              id="manageLinksWeb"
              defaultMessage="Manage your Web Links"
            />
          </label>
          <ul className="list-group mt-2">
            {
              user && user.links && user.links.map((l) => (
                l.type === 'web' ?
                  <LinkWeb
                    linkWeb={l}
                    //onMakePrimary={onLinkWebMakePrimary(l)}
                   // onEdit={onLinkEdit(l)}
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

ProfileLinksWebForm = injectIntl(reduxForm({
  form: 'userLinksWeb',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(ProfileLinksWebForm));

const EditLinksWeb = props => {
  const onSubmit = (props, dispatch) => {
    //props.user.linkType = 'web';
    //console.log( JSON.stringify(props) );
    //dispatch(editUserLinks(props));
  };
  const onSubmitSuccess = () => {
    //route('/account/...');
  };
  return (
    <ProfileLinksWebForm
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

export default connect(mapStateToProps, mapDispatchToProps)(EditLinksWeb);