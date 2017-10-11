import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from './ImageDropzone';
import Modal from './Modal';
import Layout from './Layout';
import Place from './place/PlaceContainer';
import Address from './place/Address';
import Email from './emails/Email';
import Link from './link/Link';
import LinksEdit from './link/LinksEdit';
import LinkTypes from './link/LinkTypes';
import About from './about/About';
import Languages from './language/Languages';

const General = ({
  user,
  openStagenameModal,
  closeStagenameModal,
  openPasswordModal,
  closePasswordModal,
  intl,
  addUserProfileImage,
  addUserTeaserImage,
  handleSubmit,
  saveProfile,
  fetchCountries
  }) => {

  const onProfileImageDrop = (userId) => (files, _something, _ev) => {
    addUserProfileImage(userId, files[0]);
  };

  const onTeaserImageDrop = (userId) => (files, _something, _ev) => {
    addUserTeaserImage(userId, files[0]);
  };

  if (!user._countries) {
    fetchCountries();
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
              id="general"
              defaultMessage="General"
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
              <option value="female">
                <FormattedMessage
                  id="Female"
                  defaultMessage="Female"
                />
              </option>
              <option value="male">
                <FormattedMessage
                  id="Male"
                  defaultMessage="Male"
                />
              </option>
              <option value="other">
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
                component="input"
                placeholder={intl.formatMessage({
                  id: 'surname.placeholder',
                  defaultMessage: 'Jane'
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
                component="input"
                placeholder={intl.formatMessage({
                  id: 'name.placeholder',
                  defaultMessage: 'Doe'
                })}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
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
            </div>
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
                  <About about={a} />
                ))
              }
            </ul>
          </fieldset>

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
              id="address"
              defaultMessage="Address"
            />
          </legend>

          <Place user={user} />

          <ul className="list-group mt-2">
            {
              user && user.addresses && user.addresses.map((a) => (
                <Address address={a} />
              ))
            }
          </ul>
        </fieldset>

        <LinksEdit links={user.links} LinkTypes={LinkTypes.user} />

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="links"
              defaultMessage="Links"
            />
          </legend>

          <div className="row">
            <div className="col-md-9 form-group">
              <label htmlFor="link">
                <FormattedMessage
                  id="addlink"
                  defaultMessage="Add link"
                />
              </label>
              <div className="input-group">
                <Field
                  className="form-control"
                  name="link"
                  component="input"
                  placeholder={intl.formatMessage({
                    id: 'link.placeholder',
                    defaultMessage: 'https://www...'
                  })}
                />
              </div>
            </div>
            <div className="col-md-3 form-group">
              <label htmlFor="linktype">
                <FormattedMessage
                  id="linktype"
                  defaultMessage="Link type"
                />
              </label>
              {LinkTypes.user ?
                <Field
                  className="form-control custom-select"
                  name="linktype"
                  component="select"
                  value={user.linktype}
                >
                  <option value="web">
                    <FormattedMessage
                      id="Please select"
                      defaultMessage="Please select"
                    />
                  </option>
                  {LinkTypes.user.map((c) => (
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
              id="link"
              defaultMessage="Manage your links"
            />
          </label>
          <ul className="list-group mt-2">
            {
              user && user.links && user.links.map((l) => (
                <Link link={l} />
              ))
            }
          </ul>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="emails"
              defaultMessage="Emails"
            />
          </legend>

          <div className="form-group">
            <label htmlFor="email">
              <FormattedMessage
                id="email"
                defaultMessage="Primary email, change to add new email"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="email"
                component="input"
                placeholder={intl.formatMessage({
                  id: 'email.placeholder',
                  defaultMessage: 'foo@example.com'
                })}
              />

            </div>
            <label>
              <FormattedMessage
                id="manageemail"
                defaultMessage="Manage your email addresses"
              />
            </label>
            <ul className="list-group mt-2">
              {user && user.emails && user.emails.map((e) => (
                <Email email={e} />
              ))
              }
            </ul>
          </div>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="stagename"
              defaultMessage="Stagename"
            />
          </legend>
          <p>
          <label>
              <FormattedMessage
                id="currentstagename"
                defaultMessage="Current stagename"
              />
            </label>
            : <strong>{user.stagename}</strong><br />
            <pre>{user.publicUrl}</pre> { /* FIXME */}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={openStagenameModal}
          >
            <FormattedMessage
              id="stagename.openModal"
              defaultMessage="Change your stagename"
            />
          </button>
          <Modal
            title="Caution"
            open={user._stagenameModalActive}
            close={closeStagenameModal}
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
            <p>
              <FormattedMessage
                id="stagename.change.disclaimer"
                defaultMessage="Changing your stagename can have unintended side effects!"
              />
            </p>

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
              placeholder={intl.formatMessage({
                id: 'stagename.placeholder',
                defaultMessage: 'ChangeMe'
              })}
              value={user.stagename}
            />
          </Modal>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="images"
              defaultMessage="Images"
            />
          </legend>

          <div className="form-group">
            <label htmlFor="profileImage">
              <FormattedMessage
                id="profileImage"
                defaultMessage="Profile Image"
              />
            </label>
            {user && user.image ?
              <div>
                <img
                  className="img-thumbnail mb-3"
                  src={user.image.publicUrl}
                  alt={`image of ${user.stagename}`}
                />
              </div> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(user && user.profileImageUploadInProgress)}
              onDrop={onProfileImageDrop(user._id)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">
              <FormattedMessage
                id="teaserImage"
                defaultMessage="Teaser Image"
              />
            </label>
            {user && user.teaserImage ?
              <div>
                <img
                  className="img-thumbnail mb-3"
                  src={user.teaserImage.publicUrl}
                  alt={`image of ${user.stagename}`}
                />
              </div> :
              null
            }
            <ImageDropzone
              imageUploadInProgress={(user && user.teaserImageUploadInProgress)}
              onDrop={onTeaserImageDrop(user._id)}
            />
          </div>
        </fieldset>

        <div className="form-group">
          <button
            className="btn btn-primary"
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
  enableReinitialize: true
})(General));
