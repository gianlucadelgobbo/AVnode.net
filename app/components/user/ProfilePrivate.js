import { h } from 'preact';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import ProfileLinksTel from './ProfileLinksTel';
import ProfileAddressesPrivate from './ProfileAddressesPrivate';
import validate from './validate'
import renderField from './renderField'
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

Moment.locale('en');
momentLocalizer()

// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

const ProfilePrivate = ({
  user,
  //submitting,
  intl,
  handleSubmit,
  saveProfile,
  userLinkDelete,
  userAddressDelete,
  fetchCountries
  }) => {

  if (!user._countries) {
    fetchCountries();
    //console.log('submitting' + submitting);
  }

  const handleChange = () => {
    console.log(user);
  }
  
  const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
  <DateTimePicker
    onChange={onChange}
    format="YYYY-MM-DD"
    time={showTime}
    value={!value ? null : new Date(value)}
  />

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
            <p>( 
              <FormattedMessage
                id="username"
                defaultMessage="Username"
            /> : {user.username})
            </p>
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
                    id="firstname"
                    defaultMessage="First name"
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
                  <Field    
                    name="birthday"
                    showTime={false}
                    component={renderDateTimePicker} 
                    placeholder={intl.formatMessage({
                      id: 'date.placeholder',
                      defaultMessage: 'YYYY-MM-DD'
                    })}
                  />
                  {/*
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
                    
                  />
                  
                </div>
                  */}
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

          <ProfileLinksTel
            user={user}
            intl={intl}
            userLinkDelete={userLinkDelete}
          />
          <ProfileAddressesPrivate
            user={user}
            intl={intl}
            userAddressDelete={userAddressDelete}
          />

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