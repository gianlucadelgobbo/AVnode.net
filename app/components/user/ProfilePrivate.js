import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import PhoneLinkTypes from '../link/PhoneLinkTypes';
import LinkTel from '../link/LinkTel';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePrivate = ({
  user,
  //submitting,
  intl,
  handleSubmit,
  saveProfile,
  userLinkDelete,
  //userLinkEdit,
  fetchCountries
  }) => {

  if (!user._countries) {
    fetchCountries();
    //console.log('submitting' + submitting);
  }
  /*const onLinkEdit = (link) => (e) => {
    e.preventDefault();
    return userLinkEdit(user._id, link._id);
  };*/
  const onLinkDelete = (link) => (e) => {
    e.preventDefault();
    return userLinkDelete(user._id, link._id);
  };
  const handleChange = () => {
    console.log(user);
  }

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
                id="myAccountPrivateData"
                defaultMessage="My Account Private data"
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
                    id="female"
                    defaultMessage="Female"
                  />
                </option>
                <option value="M">
                  <FormattedMessage
                    id="male"
                    defaultMessage="Male"
                  />
                </option>
                <option value="O">
                  <FormattedMessage
                    id="other"
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
                    id: 'firstname.placeholder',
                    defaultMessage: 'Name required'
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
          </fieldset>


          <fieldset className="form-group">
            <legend>
              <FormattedMessage
                id="phoneNumbers"
                defaultMessage="Phone Numbers"
              />
            </legend>
            <div className="row">
              <div className="col-md-7 form-group">
                <label htmlFor="linkTel">
                  <FormattedMessage
                    id="number"
                    defaultMessage="Number"
                  />
                </label>
                <div className="input-group">
                  <Field
                    className="form-control"
                    name="linkTel"
                    component="input"
                    placeholder={intl.formatMessage({
                      id: 'addNumber',
                      defaultMessage: 'Add/edit number'
                    })}
                    value={user.linkTel}
                  />
                </div>
              </div>
              <div className="col-md-5 form-group">
                <label htmlFor="linkType">
                  <FormattedMessage
                    id="linkType"
                    defaultMessage="Link type"
                  />
                </label>
                {PhoneLinkTypes ?
                  <Field
                    className="form-control custom-select"
                    name="linkType"
                    component="select"
                    value={user.linkType}
                  >
                    {PhoneLinkTypes.map((c) => (
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
                id="manageLinksTel"
                defaultMessage="Manage your Phone Links"
              />
            </label>
            <ul className="list-group mt-2">
              {
                user && user.links && user.links.map((l) => (
                  l.type === 'sk' || l.type === 'tel' || l.type === 'mb' ?
                    <LinkTel
                      linkTel={l}
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
  form: 'userPrivate',
  enableReinitialize: true,
  //keepDirtyOnReinitialize: true,
  validate
})(ProfilePrivate));