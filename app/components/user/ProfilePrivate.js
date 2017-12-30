import { h } from 'preact';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import LinksTel from '../link/LinksTel';
import AddressesPrivate from '../place/AddressesPrivate';
import validate from '../validate';
import renderField from '../renderField';
import ProfileNav from './ProfileNav';
import Match from 'preact-router/match';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { connect } from 'preact-redux';
import {
  fetchCountries,
  editUser
} from '../../reducers/actions';

Moment.locale('en');
momentLocalizer();

// const required = value => value ? undefined : <FormattedMessage id="Required" defaultMessage="Required" />;

let ProfilePrivateForm = props => {
  const {
    user,
  //submitting,
  intl,
  handleSubmit,
  editUser,
  //userAddressDelete,
  fetchCountries
} = props;
  if (!props.dispatch) console.log('ProfilePrivate, ERROR dispatch undefined');

  if (!user) {
    console.log('ProfilePrivate ERROR user not defined');
  }
  if (!user._countries) {
    fetchCountries();
  }

  const handleChange = () => {
    console.log(user);
  };
  
  const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
  <DateTimePicker
    onChange={onChange}
    format="YYYY-MM-DD"
    time={showTime}
    value={!value ? null : new Date(value)}
  />;

  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <ProfileNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(editUser)}>
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
                    id="name"
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
                    id: 'name.placeholder',
                    defaultMessage: 'First name required'
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

          { /* LinksTel start */}
          <FieldArray name="linksTel" component={LinksTel} />
          { /* LinksTel end */}

          { /* Addresses start */}
          <FieldArray 
            name="addresses" 
            component={AddressesPrivate} 
            props={{
              countries: props.user._countries,
              userId: props.user._id
            }}
          />
          { /* Addresses end 
          <ProfileAddressesPrivate
            user={user}
            intl={intl}
            userAddressDelete={userAddressDelete}
          />*/}

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

ProfilePrivateForm = injectIntl(reduxForm({
  form: 'userPrivate',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  validate
})(ProfilePrivateForm));

const ProfilePrivate = props => {
  console.log('ProfilePrivate props');
  const onSubmit = (props, dispatch) => {
    console.log('ProfilePrivate onSubmit dispatch' + dispatch);
    dispatch(editUser(props));
  };
  const onSubmitSuccess = () => {
    console.log('ProfilePrivate onSubmitSuccess');
  };
  return (
    <ProfilePrivateForm
      initialValues={props.user}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('--> ProfilePrivate state.user: ' + JSON.stringify(state.user._id));
  console.log('--> ProfilePrivate state.user.slug: ' + JSON.stringify(state.user.slug));
  console.log('--> ProfilePrivate state.user.stagename: ' + JSON.stringify(state.user.stagename));
  console.log('--> ProfilePrivate state.user.name: ' + JSON.stringify(state.user.name));
  return {  
    user: state.user,
    initialValues: state.user//, 
  //submitting: submitting
  };
};

const mapDispatchToProps = (dispatch) => ({
  editUser: dispatch(editUser),
  fetchCountries: dispatch(fetchCountries)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePrivate);
