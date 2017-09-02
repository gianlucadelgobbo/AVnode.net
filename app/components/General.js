import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import ImageDropzone from './ImageDropzone';
import Modal from './Modal';
import Layout from './Layout';

const Email = ({email}) => {
  return (
    <li className="list-group-item justify-content-between">
      {email.email}
      { email.is_primary ?
        <span className="badge badge-primary">
          <FormattedMessage
            id="user.edit.form.label.email.badge.primary"
            defaultMessage="Primary"
          />
        </span> :
        null
      }
      { email.is_confirmed ?
        <span className="badge badge-success">
          <FormattedMessage
            id="user.edit.form.label.email.badge.confirmed"
            defaultMessage="Confirmed"
          />
        </span> :
        <span className="badge badge-danger">
          <FormattedMessage
            id="user.edit.form.label.email.badge.unconfirmed"
            defaultMessage="Unconfirmed"
          />
        </span>
      }
      { email.is_public ?
        <span className="badge badge-default">
          <FormattedMessage
            id="user.edit.form.label.email.badge.public"
            defaultMessage="Public"
          />
        </span> :
        <span className="badge badge-default">
          <FormattedMessage
            id="user.edit.form.label.email.badge.private"
            defaultMessage="Private"
          />
        </span>
      }
      <span className="input-group-btn">
        { !email.is_primary ?
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
          >
            <FormattedMessage
              id="user.edit.form.label.email.action.primary"
              defaultMessage="Make it primary"
            />
          </button> :
          null
        }
        { email.is_public ?
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
          >
            <FormattedMessage
              id="user.edit.form.label.email.action.private"
              defaultMessage="Make it private"
            />
          </button> :
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
          >
            <FormattedMessage
              id="user.edit.form.label.email.action.public"
              defaultMessage="Make it public"
            />
          </button>
        }
        { !email.is_primary ?
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
          >
            <FormattedMessage
              id="user.edit.form.label.email.action.delete"
              defaultMessage="Delete"
            />
          </button> :
          null
        }
      </span>
    </li>
  );
};

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

  console.log(user._id, user.name, user.password);
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
              id="user.edit.form.fieldset.general"
              defaultMessage="General"
            />
          </legend>
          <div className="form-group">
            <label htmlFor="gender">
              <FormattedMessage
                id="user.edit.form.label.gender"
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
                  id="user.edit.form.label.gender.empty"
                  defaultMessage="Please select"
                />
              </option>
              <option value="female">
                <FormattedMessage
                  id="user.edit.form.label.gender.female"
                  defaultMessage="Female"
                />
              </option>
              <option value="male">
                <FormattedMessage
                  id="user.edit.form.label.gender.male"
                  defaultMessage="Male"
                />
              </option>
              <option value="other">
                <FormattedMessage
                  id="user.edit.form.label.gender.other"
                  defaultMessage="Who cares, right?"
                />
              </option>
            </Field>
          </div>
          <div className="form-group">
            <label htmlFor="name">
              <FormattedMessage
                id="user.edit.form.label.name"
                defaultMessage="Name"
              />
            </label>
            <Field
              className="form-control"
              name="name"
              component="input"
              placeholder={intl.formatMessage({
                id: 'user.edit.form.label.name.default',
                defaultMessage: 'Jane Doe'
              })}
            />
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <label htmlFor="birthday">
                <FormattedMessage
                  id="user.edit.form.label.birthday"
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
                    id: 'user.edit.form.label.name.default',
                    defaultMessage: 'YYYY-MM-DD'
                  })}
                  value={user.birthday}
                />
              </div>
            </div>
            <div className="col-md-6 form-group">
              <label htmlFor="citizenship">
                <FormattedMessage
                  id="user.edit.form.label.citizenship"
                  defaultMessage="Citizenship"
                />
              </label>
              { user._countries ?
                <Field
                  className="form-control custom-select"
                  name="citizenship"
                  component="select"
                  value={user.gender}
                >
                  <option value="">
                    <FormattedMessage
                      id="user.edit.form.label.citizenship.empty"
                      defaultMessage="Please select"
                    />
                  </option>
                  { user._countries.map((c) => (
                    <option value={c.key.toLowerCase()}>{c.name}</option>
                    ))
                  }
                  { /* FIXME: How do we handle countries here? */ }
                </Field> :
                <p>Loading a list of countries…</p>
              }
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="about">
              <FormattedMessage
                id="user.edit.form.label.about"
                defaultMessage="About you…"
              />
            </label>
            <Field
              className="form-control"
              name="about"
              component="textarea"
              rows="4"
              placeholder={intl.formatMessage({
                id: 'user.edit.form.label.about.placeholder',
                defaultMessage: 'Tell me something about you…'
              })}
              value={user.about}
            />
          </div>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="user.edit.form.fieldset.password"
              defaultMessage="Password"
            />
          </legend>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={ openPasswordModal }
          >
            <FormattedMessage
              id="user.edit.form.label.password.change"
              defaultMessage="Change your password"
            />
          </button>
          <Modal
            title="Caution"
            open={ user._passwordModalActive }
            close={ closePasswordModal }
            footer={
              <button
                type="button"
                className="btn btn-danger"
              >
                <FormattedMessage
                  id="user.edit.form.label.stagename.change"
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
                  id: 'user.edit.form.label.password.placeholder',
                  defaultMessage: 'PASSWORD'
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">
                <FormattedMessage
                  id="user.edit.form.label.newPassword"
                  defaultMessage="New Password"
                />
              </label>
              <Field
                className="form-control"
                name="newPassword"
                component="input"
                type="password"
                placeholder={intl.formatMessage({
                  id: 'user.edit.form.label.newPassword.placeholder',
                  defaultMessage: 's0m3th|ngS3cr37'
                })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">
                <FormattedMessage
                  id="user.edit.form.label.confirmNewPassword"
                  defaultMessage="Confirm Password"
                />
              </label>
              <Field
                className="form-control"
                name="confirmNewPassword"
                component="input"
                type="password"
                placeholder={intl.formatMessage({
                  id: 'user.edit.form.label.newPassword.placeholder',
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
              id="user.edit.form.fieldset.email"
              defaultMessage="Emails"
            />
          </legend>

          <div className="form-group">
            <label htmlFor="email">
              <FormattedMessage
                id="user.edit.form.label.email"
                defaultMessage="Manage your email adresses"
              />
            </label>
            <div className="input-group">
              <Field
                className="form-control"
                name="email"
                component="input"
                placeholder={intl.formatMessage({
                  id: 'user.edit.form.label.email.placeholder',
                  defaultMessage: 'foo@example.com'
                })}
              />
              <span className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-secondary"
                >
                  <FormattedMessage
                    id="user.edit.form.label.email.action.add"
                    defaultMessage="Add new Email"
                  />
                </button>
              </span>
            </div>
            <ul className="list-group mt-2">
              { user && user.emails && user.emails.map((e) => (
                <Email email={e} />
                ))
              }
            </ul>
          </div>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="user.edit.form.label.stagename"
              defaultMessage="Stagename"
            />
          </legend>
          <p>
            Current stagename: <strong>{user.stagename}</strong><br />
            <pre>{user.publicUrl}</pre> { /* FIXME */ }
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={ openStagenameModal }
          >
            <FormattedMessage
              id="user.edit.form.label.stagename.openModal"
              defaultMessage="Change your stagename"
            />
          </button>
          <Modal
            title="Caution"
            open={user._stagenameModalActive}
            close={ closeStagenameModal }
            footer={
              <button
                type="button"
                className="btn btn-danger"
              >
                <FormattedMessage
                  id="user.edit.form.label.stagename.change"
                  defaultMessage="Change"
                />
              </button>
            }
          >
            <p>
              <FormattedMessage
                id="user.edit.form.label.stagename.change.disclaimer"
                defaultMessage="Changing your stagename can have unintended side effects!"
              />
            </p>

            <label htmlFor="stagename">
              <FormattedMessage
                id="user.edit.form.label.stagename"
                defaultMessage="Stagename"
              />
            </label>
              <Field
                className="form-control"
                name="stagename"
                component="input"
                placeholder={intl.formatMessage({
                  id: 'user.edit.form.label.stagename.placeholder',
                  defaultMessage: 'Switcheroony'
                })}
                value={user.stagename}
              />
          </Modal>
        </fieldset>

        <fieldset className="form-group">
          <legend>
            <FormattedMessage
              id="user.edit.form.label.images"
              defaultMessage="Images"
            />
          </legend>

          <div className="form-group">
            <label htmlFor="profileImage">
              <FormattedMessage
                id="user.edit.form.label.profileImage"
                defaultMessage="Profile Image"
              />
            </label>
            { user && user.image ?
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
                id="user.edit.form.label.teaserImage"
                defaultMessage="Teaser Image"
              />
            </label>
            { user && user.teaserImage ?
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
              id="general.form.save"
              defaultMessage="Save"
            />
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default injectIntl(reduxForm({
  form: 'user',
  enableReinitialize: true
})(General));
