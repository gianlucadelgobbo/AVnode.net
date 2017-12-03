import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import About from '../about/About';
import Languages from '../language/Languages';

import Layout from '../Layout';
import {
  userAboutDelete,  
  editUserAbouts
} from '../../reducers/actions';

let ProfileAboutsForm = ({
  user,
  intl,
  handleSubmit,
  userAboutDelete,
  saveProfile
}) => {

  const onAboutDelete = (link) => (e) => {
    e.preventDefault();
    return userAboutDelete(user._id, link._id);
  };
  return (
    <Layout>
    <form onSubmit={handleSubmit(saveProfile)}>
        <fieldset className="form-group">
      <legend>
        <FormattedMessage
          id="abouts"
          defaultMessage="About you..."
        />
      </legend>

      <label htmlFor="about">
        <FormattedMessage
          id="addabout"
          defaultMessage="About you"
        />
      </label>
      <div className="input-group">
        <Field
          className="form-control"
          name="about"
          component="textarea"
          rows="4"
          placeholder={intl.formatMessage({
            id: 'about.placeholder',
            defaultMessage: 'Tell me something about you.'
          })}
          value={user.about}
        />
      </div>
      <div className="form-group">
        <label htmlFor="aboutlanguage">
          <FormattedMessage
            id="language"
            defaultMessage="Language"
          />
        </label>
        {Languages ?
          <Field
            className="form-control custom-select"
            name="aboutlanguage"
            component="select"
            value={user.aboutlanguage}
          >
            <option value="en">
              <FormattedMessage
                id="language.en"
                defaultMessage="English"
              />
            </option>
            {Languages.map((c) => (
              <option value={c.code}>{c.language}</option>
            ))
            }
            { /*  */}
          </Field> :
          <p>Loading languages…</p>
        }
      </div>

      <label>
        <FormattedMessage
          id="manageabout"
          defaultMessage="Manage your About texts"
        />
      </label>
      <ul className="list-group mt-2">
        {
          user && user.abouts && user.abouts.map((a) => (
            <About
              about={a}
              onDelete={onAboutDelete(a)}
              intl={intl}
            />
          ))
        }
      </ul>
    </fieldset>
    </form>
    </Layout >
  );
};

ProfileAboutsForm = injectIntl(reduxForm({
  form: 'userAbouts',
  enableReinitialize: true,
  //keepDirtyOnReinitialize: true
})(ProfileAboutsForm));

const EditAbouts = props => {
  const onSubmit = (props, dispatch) => {
  };
  const onSubmitSuccess = () => {
    //route('/account/...');
  };
  return (
    <ProfileAboutsForm
      initialValues={props.user}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  userAboutDelete: dispatch(userAboutDelete),
  saveProfile: dispatch(editUserAbouts)
});

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    initialValues: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAbouts);