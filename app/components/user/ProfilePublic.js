import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import About from '../about/About';
import Languages from '../language/Languages';
import LinkWeb from './LinkWeb';
import LinkSocial from './LinkSocial';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePublic = ({
  user,
  //submitting,
  intl,
  handleSubmit,
  saveProfile,
  fetchCountries
  }) => {

  if (!user) {
    console.log('ProfilePublic ERROR user not defined');
  }
  if (!user._countries) {
    fetchCountries();
    //console.log('submitting' + submitting);
  }

  /* const handleChange = () => {
    console.log(user);
  } */
  const onLinkWebEdit = (link) => (e) => {
    e.preventDefault();
    console.log(JSON.stringify(link));
    user.linkWeb = link.url;
    handleSubmit(saveProfile);
    /*user && user.links && user.links.map((l) => (
      l.url === link.url ? user.linkWeb = l.url : null
    ));*/
  };
  const onLinkWebMakePrimary = (link) => (e) => {
    e.preventDefault();
    console.log(JSON.stringify(link));
    user && user.links && user.links.map((l) => (
      l.is_primary = (l.url === link.url)
    ));
  };

  const onLinkSocialEdit = (link) => (e) => {
    e.preventDefault();
    console.log(JSON.stringify(link));
    user.linkSocial = link.url;
    /*user && user.links && user.links.map((l) => (
      l.url === link.url ? user.linkWeb = l.url : null
    ));*/
  };
  const onLinkSocialMakePrimary = (link) => (e) => {
    e.preventDefault();
    console.log(JSON.stringify(link));
    user && user.links && user.links.map((l) => (
      l.is_primary = (l.url === link.url)
    ));
    handleSubmit(saveProfile);
  };
  const onLinkWebDelete = (link) => (e) => {
    e.preventDefault();
    //return dispatch(onLinkWebMakePrimary(userId, linkId));
  };
  const onLinkSocialDelete = (link) => (e) => {
    e.preventDefault();

  };
  return (
    <div>
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
                value={user.linkWeb}
              />
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
                      onMakePrimary={onLinkWebMakePrimary(l)}
                      onEdit={onLinkWebEdit(l)}
                      onDelete={onLinkWebDelete(l)}
                      intl={intl}
                    />
                    :
                    null
                ))
              }
            </ul>
          </fieldset>

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
              <Field
                className="form-control"
                name="linkSocial"
                component="input"
                placeholder={intl.formatMessage({
                  id: 'addUrl',
                  defaultMessage: 'Add/edit url'
                })}
                value={user.linkSocial}
              />
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
                  l.type === 'tw' ?
                    <LinkSocial
                      linkSocial={l}
                      onMakePrimary={onLinkSocialMakePrimary(l)}
                      onEdit={onLinkSocialEdit(l)}
                      onDelete={onLinkSocialDelete(l)}
                      intl={intl}
                    />
                    :
                    null
                ))
              }
            </ul>
          </fieldset>
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
  form: 'userPublic',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
})(ProfilePublic));
