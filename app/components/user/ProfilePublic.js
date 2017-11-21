import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Modal from '../Modal';
import Layout from '../Layout';
import About from '../about/About';
import Languages from '../language/Languages';
import LinksWeb from '../link/LinksWeb';
import LinksSocial from '../link/LinksSocial';
//import LinkTypes from '../link/LinkTypes';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePublic = ({
  user,
  //submitting,
  openPasswordModal,
  closePasswordModal,
  intl,
  handleSubmit,
  saveProfile,
  fetchCountries
  }) => {

  if (!user._countries) {
    fetchCountries();
    //console.log('submitting' + submitting);
  }

  const handleChange = () => {
    console.log(user);
  }

  return (
    <div className="container-fluid account-nav-wrap">
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(saveProfile)}>
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
                defaultMessage="Stagename"
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
              <pre>{user.publicUrl}</pre> { /* FIXME */}
            </p>

            <p>
              <FormattedMessage
                id="url.change.disclaimer"
                defaultMessage="Changing your url can have unintended side effects!"
              />
            </p>


          </fieldset>

          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="abouts"
                defaultMessage="About you..."
              />
            </legend>

            <div className="row">
              <div className="col-md-9 form-group">
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
              </div>
              <div className="col-md-3 form-group">
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
                    intl={intl}
                  />
                ))
              }
            </ul>
          </fieldset>

          <label htmlFor="linkweb">
            <FormattedMessage
              id="websites"
              defaultMessage="Websites"
            />
            &nbsp;
        </label>
          <Field
            className="form-control"
            name="linkweb"
            component="input"
            type="text"
            value={user.linkweb}
          />
          <LinksWeb links={user.links} />

          <label htmlFor="linksocial">
            <FormattedMessage
              id="socials"
              defaultMessage="Social channels"
            />
            &nbsp;
        </label>
          <Field
            className="form-control"
            name="linksocial"
            component="input"
            type="text"
            value={user.linksocial}
          />
          <LinksSocial links={user.links} />

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

export default injectIntl(reduxForm({
  form: 'user',
  enableReinitialize: true,
  validate
})(ProfilePublic));
