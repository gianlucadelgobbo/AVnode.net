import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import About from '../about/About';
import Languages from '../language/Languages';
import LinkType from '../link/LinkType';
import LinkWeb from '../link/LinkWeb';
import LinkSocial from '../link/LinkSocial';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePublic = ({
  user,
  //submitting,
  dirty,
  invalid,
  pristine,
  valid,
  intl,
  handleSubmit,
  saveProfile,
  userAboutEdit,
  userAboutDelete,
//  userLinkMakePrimary,
  userLinkDelete,
  userLinkEdit,
  fetchCountries
  }) => {

  if (!user) {
    console.log('ProfilePublic ERROR user not defined');
  }
  if (!user._countries) {
    fetchCountries();
  }


  const onAboutEdit = (about) => (e) => {
    e.preventDefault();
    console.log('dirty:' + dirty + ' invalid:' + invalid + ' pristine:' + pristine + ' valid:' + valid);
    return userAboutEdit(user._id, about.lang);
  };
  const onAboutDelete = (about) => (e) => {
    e.preventDefault();
    return userAboutDelete(user._id, about.lang);
  };

  const onLinkEdit = (link) => (e) => {
    e.preventDefault();
    return userLinkEdit(user._id, link._id);
  };
  const onLinkDelete = (link) => (e) => {
    e.preventDefault();
    return userLinkDelete(user._id, link._id);
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
                    onEdit={onAboutEdit(a)}
                    onDelete={onAboutDelete(a)}
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
                      //onMakePrimary={onLinkWebMakePrimary(l)}
                      onEdit={onLinkEdit(l)}
                      onDelete={onLinkDelete(l)}
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
            <div className="row">
              <div className="col-md-9 form-group">
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
              </div>
              <div className="col-md-3 form-group">
                <label htmlFor="linkType">
                  <FormattedMessage
                    id="linkType"
                    defaultMessage="Link type"
                  />
                </label>
                {LinkType ?
                  <Field
                    className="form-control custom-select"
                    name="linkType"
                    component="select"
                    value={user.linkType}
                  >
                    <option value="ot">
                      <FormattedMessage
                        id="Please select"
                        defaultMessage="Please select"
                      />
                    </option>
                    {LinkType.map((c) => (
                      <option value={c.key.toLowerCase()}>{c.name}</option>
                    ))
                    }
                    { /*  */}
                  </Field> :
                  <p>Loading a link types…</p>
                }
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
                      onEdit={onLinkEdit(l)}
                      onDelete={onLinkDelete(l)}
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
