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

// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePublic = ({
  user,
  //submitting,
  openStagenameModal,
  closeStagenameModal,
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
          <div className="form-group">
            <label htmlFor="gender">
              <FormattedMessage
                id="gender"
                defaultMessage="Gender"
              />
            </label>
            <Field
              className="form-control custom-select"
              name="gender"
              component="select"
            >
              <option value="">
                <FormattedMessage
                  id="Please select"
                  defaultMessage="Please select"
                />
              </option>
              <option value="F">
                <FormattedMessage
                  id="Female"
                  defaultMessage="Female"
                />
              </option>
              <option value="M">
                <FormattedMessage
                  id="Male"
                  defaultMessage="Male"
                />
              </option>
              <option value="O">
                <FormattedMessage
                  id="Other"
                  defaultMessage="Other"
                />
              </option>
            </Field>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="surname">
                <FormattedMessage
                  id="surname"
                  defaultMessage="Surname"
                />
              </label>
              <Field
                className="form-control"
                name="surname"
                type="text"
                component={renderField}
                placeholder={intl.formatMessage({
                  id: 'surname.placeholder',
                  defaultMessage: 'Surname required'
                })}
              />
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="name">
                <FormattedMessage
                  id="name"
                  defaultMessage="Name"
                />
              </label>
              <Field
                className="form-control"
                name="name"
                component={renderField}
                type="text"
                onChange={handleChange}
                placeholder={intl.formatMessage({
                  id: 'name.placeholder',
                  defaultMessage: 'Name required'
                })}
              />
            </div>
          </div>
          <div className="row">
            {/*<div className="col-md-6 form-group">
              <label htmlFor="birthday">
                <FormattedMessage
                  id="birthday"
                  defaultMessage="Birthday"
                />
              </label>
              <div className="input-group date" data-provide="datepicker-inline">
                <div className="input-group-addon">
                  <i className="fa fa-calendar"></i>
                </div>
                <Field
                  className="form-control"
                  name="birthday"
                  component="input"
                  data-provide="datepicker"
                  data-date-format="yyyy-mm-dd"
                  placeholder={intl.formatMessage({
                    id: 'date.placeholder',
                    defaultMessage: 'YYYY-MM-DD'
                  })}
                  value={user.birthday}
                />
              </div>
                </div>*/ }
            <div className="col-md-6 form-group">
              <label htmlFor="citizenship">
                <FormattedMessage
                  id="citizenship"
                  defaultMessage="Citizenship"
                />
              </label>
              {user._countries ?
                <Field
                  className="form-control custom-select"
                  name="citizenship"
                  component="select"
                  value={user.citizenship}
                >
                  <option value="">
                    <FormattedMessage
                      id="Please select"
                      defaultMessage="Please select"
                    />
                  </option>
                  {user._countries.map((c) => (
                    <option value={c.key.toLowerCase()}>{c.name}</option>
                  ))
                  }
                  { /* FIXME: How do we handle countries here? */}
                </Field> :
                <p>Loading a list of countries…</p>
              }
            </div>
          </div>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="password"
              defaultMessage="Password"
            />
          </legend>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={openPasswordModal}
          >
            <FormattedMessage
              id="password.change"
              defaultMessage="Change your password"
            />
          </button>
          <Modal
            title="Caution"
            open={user._passwordModalActive}
            close={closePasswordModal}
            footer={
              <button
                type="button"
                className="btn btn-danger"
              >
                <FormattedMessage
                  id="change"
                  defaultMessage="Change"
                />
              </button>
            }
          >
            <div className="form-group">
              <label htmlFor="password">
                <FormattedMessage
                  id="user.edit.form.label.password"
                  defaultMessage="Current Password"
                />
              </label>
              <Field
                className="form-control"
                name="password"
                component="input"
                type="password"
                placeholder={intl.formatMessage({
                  id: 'password.placeholder',
                  defaultMessage: 'PASSWORD'
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">
                <FormattedMessage
                  id="newPassword"
                  defaultMessage="New Password"
                />
              </label>
              <Field
                className="form-control"
                name="newPassword"
                component="input"
                type="password"
                placeholder={intl.formatMessage({
                  id: 'newPassword.placeholder',
                  defaultMessage: 's0m3th|ngS3cr37'
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">
                <FormattedMessage
                  id="confirmNewPassword"
                  defaultMessage="Confirm Password"
                />
              </label>
              <Field
                className="form-control"
                name="confirmNewPassword"
                component="input"
                type="password"
                placeholder={intl.formatMessage({
                  id: 'newPassword.placeholder',
                  defaultMessage: 's0m3th|ngS3cr37'
                })}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary" type="submit">
                Change Password
              </button>
            </div>
          </Modal>
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
  );
};

export default injectIntl(reduxForm({
  form: 'user',
  enableReinitialize: true,
  validate
})(ProfilePublic));
