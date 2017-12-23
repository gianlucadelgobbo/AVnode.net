import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
import EventNav from './EventNav';
import Match from 'preact-router/match';

import {
  editEvent
} from '../../reducers/actions';

let EventSettingsForm = props => {
  const { handleSubmit, editEvent, event, intl } = props


  return (
    <div>
      <div className="container-fluid">
        <Match>
          {({ url }) => <EventNav url={url} />}
        </Match>
      </div>
      <Layout>
        <form onSubmit={handleSubmit(editEvent)}>
          <Field
            name="_id"
            component="input"
            type="hidden"
          />

<div className="form-check">
          <label className="form-check-label">
            <Field
              className="form-check-input form-control-lg"
              name="is_public"
              component="input"
              type="checkbox"
              value={props.is_public}
            />
            <FormattedMessage
              id="eventIsPublic"
              defaultMessage="Event is public"
            />
          </label>
        </div>

        <div className="form-check">
          <label className="form-check-label">
            <Field
              className="form-check-input form-control-lg"
              name="is_open"
              component="input"
              type="checkbox"
              value={props.is_open}
            />
            <FormattedMessage
              id="callIsOpen"
              defaultMessage="Call is open"
            />
          </label>
        </div>


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
      </Layout>
    </div>
  );
};

EventSettingsForm = injectIntl(reduxForm({ form: 'EventSettings' })(EventSettingsForm));

const EventSettings = props => {
  console.log('EventSettings props');
  const onSubmit = (props, dispatch) => {
    console.log('EventSettings onSubmit');
  };
  const onSubmitSuccess = () => {
    console.log('EventSettings onSubmitSuccess');
  };
  return (
    <EventSettingsForm
      initialValues={props.event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('_______________ props __________________________________');
  console.log('--> EventSettings props.url: ' + JSON.stringify(props.url));
  console.log('_______________ state __________________________________');
  console.log('--> EventSettings state.user.eventId: ' + JSON.stringify(state.user.eventId));
  return {
    event: (state.user.events.find(e => { return e._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  editEvent: dispatch(editEvent)
});

export default connect(mapStateToProps, mapDispatchToProps)(EventSettings);
