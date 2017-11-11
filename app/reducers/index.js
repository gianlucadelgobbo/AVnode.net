import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import R from 'ramda';

import {
  NAVIGATE,
  GOT_USER,
  EDIT_USER,
  CHANGE_LANGUAGE,
  RESPONSE_LINKTYPES,
  RESPONSE_COUNTRIES,
  REQUEST_ADD_USERPROFILEIMAGE,
  REQUEST_ADD_USERTEASERIMAGE,
  OPEN_STAGENAME_MODAL,
  CLOSE_STAGENAME_MODAL,
  OPEN_PASSWORD_MODAL,
  CLOSE_PASSWORD_MODAL,
  REQUEST_USER_MAKEABOUTPRIMARY,
  REQUEST_USER_DELETEABOUT,
  REQUEST_USER_MAKELINKPRIMARY,

  EDIT_EVENT,
  REQUEST_DELETE_EVENT,
  REQUEST_EDIT_EVENT,
  REQUEST_ADD_EVENT,
  REQUEST_ADD_EVENTIMAGE,
  REQUEST_SUGGEST_EVENT_PERFORMANCE,
  RESPONSE_SUGGEST_EVENT_PERFORMANCE,
  REQUEST_SUGGEST_EVENT_ORGANIZER,
  RESPONSE_SUGGEST_EVENT_ORGANIZER,
  REQUEST_SUGGEST_EVENT_ORGANIZINGCREW,
  RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW,

  REQUEST_ADD_CREW,
  REQUEST_SUGGEST_CREWMEMBER,
  RESPONSE_SUGGEST_CREWMEMBER,
  REQUEST_ADD_CREWIMAGE,
  ADD_CREWMEMBER,
  REQUEST_DELETE_CREWMEMBER,
  REQUEST_CREW_MAKEABOUTPRIMARY,

  REQUEST_ADD_PERFORMANCE,
  REQUEST_ADD_PERFORMANCEIMAGE,
  REQUEST_SUGGEST_PERFORMANCE_CREW,
  RESPONSE_SUGGEST_PERFORMANCE_CREW,
  REQUEST_SUGGEST_PERFORMANCE_PERFORMER,
  RESPONSE_SUGGEST_PERFORMANCE_PERFORMER
} from './actions';

const initialValues = {
  active: window.location.pathname,
  events: [],
  performances: [],
  crews: []
};
const event = (state = {}, action) => {
  console.log('event action type: ' + action.type + ' action: ' + JSON.stringify(action));
  switch (action.type) {
    case EDIT_EVENT:
      if (state._id !== action.json._id) {
        return state;
      }
      return Object.assign({}, state, action.json);
    case REQUEST_ADD_EVENT:
      return Object.assign({}, state, {
        ajaxInProgress: true
      });
    case REQUEST_DELETE_EVENT:
      if (state._id !== action.id) {
        return state;
      }
      return Object.assign({}, state, {
        ajaxInProgress: true
      });
    case REQUEST_ADD_EVENTIMAGE:
      if (state._id !== action.payload.eventId) {
        return state;
      }
      return Object.assign({}, state, {
        imageUploadInProgress: true
      });
    default:
      console.log('info, event action not handled: ' + action.type);
      return state;
  }
};

const crew = (state = {}, action) => {
  console.log('crew action type: ' + action.type + ' action: ' + JSON.stringify(action));
  switch (action.type) {
    case ADD_CREWMEMBER:
      if (state._id !== action.payload.crewId) {
        return state;
      }
      return Object.assign({}, state, {
        members: R.append(action.payload.member, state.members)
      });
    case REQUEST_ADD_CREWIMAGE:
      if (state._id !== action.payload.crewId) {
        return state;
      }
      return Object.assign({}, state, {
        imageUploadInProgress: true
      });
    case REQUEST_DELETE_CREWMEMBER:
      if (state._id !== action.payload.crewId) {
        return state;
      }
      return Object.assign({}, state, {
        members: state.members.map((m) => {
          if (m._id === action.payload.memberId) {
            return Object.assign({}, m, {
              deletionInProgress: true
            });
          } else {
            return m;
          }
        })
      });
    case REQUEST_CREW_MAKEABOUTPRIMARY:
      return state;
    default:
      console.log('info, crew action not handled: ' + action.type);
      return state;
  }
};

const performance = (state = {}, action) => {
  console.log('performance action type: ' + action.type + ' action: ' + JSON.stringify(action));
  switch (action.type) {
    case REQUEST_ADD_PERFORMANCEIMAGE:
      if (state._id !== action.payload.performanceId) {
        return state;
      }
      return Object.assign({}, state, {
        imageUploadInProgress: true
      });
    default:
      console.log('info, performance action not handled: ' + action.type);
      return state;
  }
};

// EVENT.REQUEST_ADD
// CREW.REQUEST_SUGGEST_MEMBER
const user = (state = initialValues, action) => {
  //console.log('user action type: ' + action.type);
  //if (action.type != 'GOT_USER') console.log('user action: ' + JSON.stringify(action));
  switch (action.type) {
    case NAVIGATE:
      return Object.assign({}, state, {
        active: action.active
      });
    case GOT_USER:
      return Object.assign({}, state, action.json, {
        ajaxInProgress: false
      });
    case EDIT_USER:
      return state;
    case REQUEST_ADD_USERPROFILEIMAGE:
      return Object.assign({}, state, {
        profileImageUploadInProgress: true
      });
    case REQUEST_ADD_USERTEASERIMAGE:
      return Object.assign({}, state, {
        teaserImageUploadInProgress: true
      });

    case REQUEST_ADD_PERFORMANCE:
      return Object.assign({}, state, {
        ajaxInProgress: true
      });

    case EDIT_EVENT:
      return state; // FIXME?!

    case REQUEST_ADD_EVENT:
      return Object.assign({}, state, event(state, action), {
        ajaxInProgress: true
      });
    case REQUEST_EDIT_EVENT:
    case REQUEST_DELETE_EVENT:
      return Object.assign({}, state, {
        events: state.events.map((e) => {
          return event(e, action);
        })
      });
    case RESPONSE_SUGGEST_CREWMEMBER:
      return Object.assign({}, state, {
        _memberSuggestions: action.suggestions,
        _memberSuggestionInProgress: false
      });
    case REQUEST_SUGGEST_CREWMEMBER:
      return Object.assign({}, state, {
        _memberSuggestionInProgress: true
      });
    case REQUEST_SUGGEST_PERFORMANCE_CREW:
      return Object.assign({}, state, {
        _crewSuggestionInProgress: true
      });
    case RESPONSE_SUGGEST_PERFORMANCE_CREW:
      return Object.assign({}, state, {
        _crewSuggestions: action.suggestions,
        _crewSuggestionInProgress: false
      });
    case REQUEST_SUGGEST_PERFORMANCE_PERFORMER:
      return Object.assign({}, state, {
        _performerSuggestionInProgress: true
      });
    case RESPONSE_SUGGEST_PERFORMANCE_PERFORMER:
      return Object.assign({}, state, {
        _performerSuggestions: action.suggestions,
        _performerSuggestionInProgress: false
      });
    case REQUEST_SUGGEST_EVENT_PERFORMANCE:
      return Object.assign({}, state, {
        _performanceSuggestionInProgress: true
      });
    case RESPONSE_SUGGEST_EVENT_PERFORMANCE:
      return Object.assign({}, state, {
        _performanceSuggestions: action.suggestions,
        _performanceSuggestionInProgress: false
      });
    case REQUEST_SUGGEST_EVENT_ORGANIZER:
      return Object.assign({}, state, {
        _organizerSuggestionInProgress: true
      });
    case RESPONSE_SUGGEST_EVENT_ORGANIZER:
      return Object.assign({}, state, {
        _organizerSuggestions: action.suggestions,
        _organizerSuggestionInProgress: false
      });
    case REQUEST_SUGGEST_EVENT_ORGANIZINGCREW:
      return Object.assign({}, state, {
        _organizingCrewSuggestionInProgress: true
      });
    case RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW:
      return Object.assign({}, state, {
        _organizingCrewSuggestions: action.suggestions,
        _organizingCrewSuggestionInProgress: false
      });
    case REQUEST_ADD_CREWIMAGE:
    case REQUEST_DELETE_CREWMEMBER:
    case ADD_CREWMEMBER:
    case REQUEST_CREW_MAKEABOUTPRIMARY:
      return Object.assign({}, state, {
        crews: state.crews.map((c) => {
          return crew(c, action);
        })
      });

    case REQUEST_ADD_CREWIMAGE:
      return Object.assign({}, state, {
        performances: state.performances.map((c) => {
          return performance(c, action);
        })
      });

    case REQUEST_ADD_CREW:
      return Object.assign({}, state, {
        ajaxInProgress: true
      });

    case OPEN_STAGENAME_MODAL:
      return Object.assign({}, state, {
        _stagenameModalActive: true
      });
    case CLOSE_STAGENAME_MODAL:
      return Object.assign({}, state, {
        _stagenameModalActive: false
      });
    case OPEN_PASSWORD_MODAL:
      return Object.assign({}, state, {
        _passwordModalActive: true
      });
    case CLOSE_PASSWORD_MODAL:
      return Object.assign({}, state, {
        _passwordModalActive: false
      });
    case CHANGE_LANGUAGE:
      return Object.assign({}, state, {
        settings: Object.assign({}, state.settings, {
          language: action.payload.language
        })
      });
    case RESPONSE_LINKTYPES:
      return Object.assign({}, state, {
        _linktypes: action.payload.linktypes
      });
    case RESPONSE_COUNTRIES:
      return Object.assign({}, state, {
        _countries: action.payload.countries
      });
    case REQUEST_USER_MAKEABOUTPRIMARY:
    case REQUEST_USER_DELETEABOUT:
    case REQUEST_USER_MAKELINKPRIMARY:
      return state;
    /*case '@@redux-form/BLUR':
      console.log('BLUR field ' + JSON.stringify(action));
      return Object.assign({}, state, {
        action: action
      });*/
    default:
      console.log('info, user action not handled: ' + action.type);
      return state;
  }
};

const reducer = combineReducers({
  user,
  form: formReducer
});

export default reducer;
