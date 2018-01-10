import { h } from 'preact';
import { connect } from 'preact-redux';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';
import Layout from '../Layout';
// import Languages from '../language/Languages';

import EventNav from './EventNav';
import Match from 'preact-router/match';

import {
  editEvent,
  suggestEventPerformance,
  addEventPerformance,
  removeEventPerformance,

  suggestEventOrganizer,
  addEventOrganizer,
  removeEventOrganizer,

  suggestEventOrganizingCrew,
  addEventOrganizingCrew,
  removeEventOrganizingCrew
} from '../../reducers/actions';

const OrganizingCrew = injectIntl(({ crew, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {crew.name}
      </span>
      {crew.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

const Performance = injectIntl(({ performance, onDelete, intl }) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {performance.title}
      </span>
      {performance.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

const Organizer = injectIntl(({ organizer, me, onDelete, intl }) => {
  const meLabel = intl.formatMessage({
    id: 'Me',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${organizer.stagename} `}
        {(organizer._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      {organizer.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

let EventPerformancesForm = props => {
  const { handleSubmit, editEvent, event, intl } = props

  const removeCategory = (categoryId) => (e) => {
    e.preventDefault();
    // BL CHECK return dispatch(removeEventCategory(event._id, categoryId));
    return removeEventCategory(event._id, categoryId);
  };
  const performanceSuggestions = props.user._performanceSuggestions || [];
  
    const findPerformance = (e) => {
      e.preventDefault();
      if (e.target.value.length > 2) {
        return dispatch(suggestEventPerformance(event._id, e.target.value));
      } // FIXME: handle reset
    };
  
    const addPerformance = (performanceId) => (e) => {
      e.preventDefault();
      return dispatch(addEventPerformance(event._id, performanceId));
    };
  
    const removePerformance = (performanceId) => (e) => {
      e.preventDefault();
      return dispatch(removeEventPerformance(event._id, performanceId));
    };
  
    const organizerSuggestions = props.user._organizerSuggestions || [];
  
    const findOrganizer = (e) => {
      e.preventDefault();
      if (e.target.value.length > 2) {
        return dispatch(suggestEventOrganizer(event._id, e.target.value));
      } // FIXME: handle reset
    };
  
    const addOrganizer = (organizerId) => (e) => {
      e.preventDefault();
      return dispatch(addEventOrganizer(event._id, organizerId));
    };
  
    const removeOrganizer = (organizerId) => (e) => {
      e.preventDefault();
      return dispatch(removeEventOrganizer(event._id, organizerId));
    };
  
    const organizingCrewSuggestions = props.user._organizingCrewSuggestions || [];
  
    const findOrganizingCrew = (e) => {
      e.preventDefault();
      if (e.target.value.length > 2) {
        return dispatch(suggestEventOrganizingCrew(event._id, e.target.value));
      } // FIXME: handle reset
    };
  
    const addOrganizingCrew = (organizingCrewId) => (e) => {
      e.preventDefault();
      return dispatch(addEventOrganizingCrew(event._id, organizingCrewId));
    };
  
    const removeOrganizingCrew = (organizingCrewId) => (e) => {
      e.preventDefault();
      return dispatch(removeEventOrganizingCrew(event._id, organizingCrewId));
    };
  
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

<div className="form-group">
          <label htmlFor="performances">
            <FormattedMessage
              id="performances"
              defaultMessage="Performances"
            />
          </label>
          <ul className="list-group">
            {event && event.performances && event.performances.map((performance) => (
              <Performance
                performance={performance}
                onDelete={removePerformance(performance.id)}
              />
            ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="performance">
            <FormattedMessage
              id="assignPerformances"
              defaultMessage="Assign performances"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'suggestPerformances',
              defaultMessage: 'Type to find performances…'
            })}
            onKeyUp={findPerformance}
          />
          <div className="mt-1 list-group">
            {event && event._performanceSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestPerformancesloading"
                  defaultMessage="Finding performances…"
                />
              </div> :
              null
            }
            {performanceSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addPerformance(c.id)}
              >
                {c.title}
              </button>
            ))
            }
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizers">
            <FormattedMessage
              id="organizers"
              defaultMessage="Organizers"
            />
          </label>
          <ul className="list-group">
            {event && event.organizers && event.organizers.map((organizer) => (
              <Organizer
                organizer={organizer}
                me={props.user._id}
                onDelete={removeOrganizer(organizer.id)}
              />
            ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="organizer">
            <FormattedMessage
              id="assignOrganizers"
              defaultMessage="Assign organizers"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'suggestOrganizers',
              defaultMessage: 'Type to find organizers…'
            })}
            onKeyUp={findOrganizer}
          />
          <div className="mt-1 list-group">
            {event && event._organizerSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestOrganizersLoading"
                  defaultMessage="Finding organizers…"
                />
              </div> :
              null
            }
            {organizerSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addOrganizer(c.id)}
              >
                {c.stagename} ({c.name})
                </button>
            ))
            }
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizingCrews">
            <FormattedMessage
              id="organizingCrews"
              defaultMessage="Organizing Crews"
            />
          </label>
          <ul className="list-group">
            {event && event.organizing_crews && event.organizing_crews.map((crew) => (
              <OrganizingCrew
                crew={crew}
                onDelete={removeOrganizingCrew(crew.id)}
              />
            ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="organizingCrew">
            <FormattedMessage
              id="assignOrganizingCrews"
              defaultMessage="Assign an organizing crew"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'suggestOrganizingCrews',
              defaultMessage: 'Type to find crews…'
            })}
            onKeyUp={findOrganizingCrew}
          />
          <div className="mt-1 list-group">
            {event && event._organizingCrewSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="suggestOrganizingCrewsLoading"
                  defaultMessage="Finding organizingCrews…"
                />
              </div> :
              null
            }
            {organizingCrewSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={addOrganizingCrew(c.id)}
              >
                {c.stagename} ({c.name})
                </button>
            ))
            }
          </div>
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

EventPerformancesForm = injectIntl(reduxForm({ form: 'EventPerformances' })(EventPerformancesForm));

const EventPerformances = props => {
  console.log('EventPerformances props');
  const onSubmit = (props, dispatch) => {
    console.log('EventPerformances onSubmit');
  };
  const onSubmitSuccess = () => {
    console.log('EventPerformances onSubmitSuccess');
  };
  return (
    <EventPerformancesForm
      initialValues={props.event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  console.log('_______________ props __________________________________');
  console.log('--> EventPerformances props.url: ' + JSON.stringify(props.url));
  console.log('_______________ state __________________________________');
  console.log('--> EventPerformances state.user.eventId: ' + JSON.stringify(state.user.eventId));
  return {
    event: (state.user.events.find(e => { return e._id === props._id; })),
    user: state.user
  };
};
const mapDispatchToProps = (dispatch) => ({
  editEvent: dispatch(editEvent)
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPerformances);
