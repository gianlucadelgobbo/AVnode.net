import isomorphicFetch from 'isomorphic-fetch';

export const NAVIGATE = 'NAVIGATE';
export const CREW_NAVIGATE = 'CREW_NAVIGATE';
export const PERFORMANCE_NAVIGATE = 'PERFORMANCE_NAVIGATE';
export const EVENT_NAVIGATE = 'EVENT_NAVIGATE';
export const GOT_USER = 'GOT_USER';
export const REQUEST_EDIT_USER = 'REQUEST_EDIT_USER';
export const REQUEST_EDIT_USERIMAGES = 'REQUEST_EDIT_USERIMAGES';
export const REQUEST_EDIT_USERLINKS = 'REQUEST_EDIT_USERLINKS';
export const REQUEST_ADD_USEREMAIL = 'REQUEST_ADD_USEREMAIL';
export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export const RESPONSE_LINKTYPES = 'RESPONSE_LINKTYPES';
export const RESPONSE_COUNTRIES = 'RESPONSE_COUNTRIES';
export const REQUEST_ADD_USERPROFILEIMAGE = 'REQUEST_ADD_USERPROFILEIMAGE';
export const REQUEST_ADD_USERTEASERIMAGE = 'REQUEST_ADD_USERTEASERIMAGE';
export const OPEN_STAGENAME_MODAL = 'OPEN_STAGENAME_MODAL';
export const CLOSE_STAGENAME_MODAL = 'CLOSE_STAGENAME_MODAL';
export const OPEN_PASSWORD_MODAL = 'OPEN_PASSWORD_MODAL';
export const CLOSE_PASSWORD_MODAL = 'CLOSE_PASSWORD_MODAL';
export const REQUEST_ADD_USER_PLACE = 'REQUEST_ADD_USER_PLACE';
export const REQUEST_USER_DELETEPLACE = 'REQUEST_USER_DELETEPLACE';
export const REQUEST_ADD_USER_LINK = 'REQUEST_ADD_USER_LINK';
export const REQUEST_USER_DELETELINK = 'REQUEST_USER_DELETELINK';
export const REQUEST_USER_EDITABOUT = 'REQUEST_USER_EDITABOUT';
export const REQUEST_USER_DELETEABOUT = 'REQUEST_USER_DELETEABOUT';
export const REQUEST_USER_MAKELINKPRIMARY = 'REQUEST_USER_MAKELINKPRIMARY';
export const REQUEST_USER_EDITLINK = 'REQUEST_USER_EDITLINK';
export const REQUEST_USER_MAKELINKPRIVATE = 'REQUEST_USER_MAKELINKPRIVATE';
export const REQUEST_USER_MAKELINKPUBLIC = 'REQUEST_USER_MAKELINKPUBLIC';
export const REQUEST_USER_LINKCONFIRM = 'REQUEST_USER_LINKCONFIRM';
export const REQUEST_USER_DELETEEMAIL = 'REQUEST_USER_DELETEEMAIL';
export const REQUEST_USER_MAKEEMAILPRIMARY = 'REQUEST_USER_MAKEEMAILPRIMARY';
export const REQUEST_USER_MAKEEMAILPRIVATE = 'REQUEST_USER_MAKEEMAILPRIVATE';
export const REQUEST_USER_MAKEEMAILPUBLIC = 'REQUEST_USER_MAKEEMAILPUBLIC';
export const REQUEST_USER_TOGGLEPRIVACY = 'REQUEST_USER_TOGGLEPRIVACY';
export const REQUEST_USER_EMAILCONFIRM = 'REQUEST_USER_EMAILCONFIRM';
export const REQUEST_USER_MAKEADDRESSPRIMARY = 'REQUEST_USER_MAKEADDRESSPRIMARY';
export const REQUEST_USER_MAKEADDRESSPRIVATE = 'REQUEST_USER_MAKEADDRESSPRIVATE';
export const REQUEST_USER_MAKEADDRESSPUBLIC = 'REQUEST_USER_MAKEADDRESSPUBLIC';
export const REQUEST_USER_DELETEADDRESS = 'REQUEST_USER_DELETEADDRESS';

export const DELETE_EVENT = 'DELETE_EVENT';
export const ADD_EVENT = 'ADD_EVENT';
export const EDIT_EVENT = 'EDIT_EVENT';
export const REQUEST_DELETE_EVENT = 'REQUEST_DELETE_EVENT';
export const REQUEST_ADD_EVENT = 'REQUEST_ADD_EVENT';
export const REQUEST_EDIT_EVENT = 'REQUEST_EDIT_EVENT';
export const REQUEST_ADD_EVENTIMAGE = 'REQUEST_ADD_EVENTIMAGE';
export const REQUEST_ADD_EVENTTEASERIMAGE = 'REQUEST_ADD_EVENTTEASERIMAGE';
export const REQUEST_SUGGEST_EVENT_PERFORMANCE = 'REQUEST_SUGGEST_EVENT_PERFORMANCE';
export const RESPONSE_SUGGEST_EVENT_PERFORMANCE = 'RESPONSE_SUGGEST_EVENT_PERFORMANCE';
export const REQUEST_ADD_EVENT_PERFORMANCE = 'REQUEST_ADD_EVENT_PERFORMANCE';
export const REQUEST_DELETE_EVENT_PERFORMANCE = 'REQUEST_DELETE_EVENT_PERFORMANCE';
export const REQUEST_SUGGEST_EVENT_ORGANIZER = 'REQUEST_SUGGEST_EVENT_ORGANIZER';
export const RESPONSE_SUGGEST_EVENT_ORGANIZER = 'RESPONSE_SUGGEST_EVENT_ORGANIZER';
export const REQUEST_ADD_EVENT_ORGANIZER = 'REQUEST_ADD_EVENT_ORGANIZER';
export const REQUEST_DELETE_EVENT_ORGANIZER = 'REQUEST_DELETE_EVENT_ORGANIZER';
export const REQUEST_SUGGEST_EVENT_ORGANIZINGCREW = 'REQUEST_SUGGEST_EVENT_ORGANIZINGCREW';
export const RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW = 'RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW';
export const REQUEST_ADD_EVENT_ORGANIZINGCREW = 'REQUEST_ADD_EVENT_ORGANIZINGCREW';
export const REQUEST_DELETE_EVENT_ORGANIZINGCREW = 'REQUEST_DELETE_EVENT_ORGANIZINGCREW';
export const REQUEST_ADD_EVENT_VENUE = 'REQUEST_ADD_EVENT_VENUE';
export const REQUEST_DELETE_EVENT_VENUE = 'REQUEST_DELETE_EVENT_VENUE';
export const REQUEST_DELETE_EVENT_CATEGORY = 'REQUEST_DELETE_EVENT_CATEGORY';
export const REQUEST_ADD_EVENT_CATEGORY = 'REQUEST_ADD_EVENT_CATEGORY';

export const REQUEST_ADD_CREW = 'REQUEST_ADD_CREW';
export const REQUEST_DELETE_CREW = 'REQUEST_DELETE_CREW';
export const REQUEST_EDIT_CREW = 'REQUEST_EDIT_CREW';
export const REQUEST_SUGGEST_CREWMEMBER = 'REQUEST_SUGGEST_CREWMEMBER';
export const RESPONSE_SUGGEST_CREWMEMBER = 'RESPONSE_SUGGEST_CREWMEMBER';
export const REQUEST_ADD_CREWMEMBER = 'REQUEST_ADD_CREWMEMBER';
export const REQUEST_DELETE_CREWMEMBER = 'REQUEST_DELETE_CREWMEMBER';
export const REQUEST_ADD_CREWIMAGE = 'REQUEST_ADD_CREWIMAGE';
export const REQUEST_ADD_CREWTEASERIMAGE = 'REQUEST_ADD_CREWTEASERIMAGE';
export const REQUEST_ADD_CREWORGLOGO = 'REQUEST_ADD_CREWORGLOGO';
export const REQUEST_CREW_EDITABOUT = 'REQUEST_CREW_EDITABOUT';
export const REQUEST_CREW_DELETEABOUT = 'REQUEST_CREW_DELETEABOUT';

export const REQUEST_ADD_PERFORMANCE = 'REQUEST_ADD_PERFORMANCE';
export const REQUEST_DELETE_PERFORMANCE = 'REQUEST_DELETE_PERFORMANCE';
export const REQUEST_EDIT_PERFORMANCE = 'REQUEST_EDIT_PERFORMANCE';
export const REQUEST_EDIT_PERFORMANCEABOUTS = 'REQUEST_EDIT_PERFORMANCEABOUTS';
export const REQUEST_ADD_PERFORMANCEIMAGE = 'REQUEST_ADD_PERFORMANCEIMAGE';
export const REQUEST_ADD_PERFORMANCETEASERIMAGE = 'REQUEST_ADD_PERFORMANCETEASERIMAGE';
export const REQUEST_ADD_PERFORMANCEVIDEO = 'REQUEST_ADD_PERFORMANCEVIDEO';
export const REQUEST_SUGGEST_PERFORMANCE_CREW = 'REQUEST_SUGGEST_PERFORMANCE_CREW';
export const RESPONSE_SUGGEST_PERFORMANCE_CREW = 'RESPONSE_SUGGEST_PERFORMANCE_CREW';
export const REQUEST_ADD_PERFORMANCE_CREW = 'REQUEST_ADD_PERFORMANCE_CREW';
export const REQUEST_DELETE_PERFORMANCE_CREW = 'REQUEST_DELETE_PERFORMANCE_CREW';
export const REQUEST_SUGGEST_PERFORMANCE_PERFORMER = 'REQUEST_SUGGEST_PERFORMANCE_PERFORMER';
export const RESPONSE_SUGGEST_PERFORMANCE_PERFORMER = 'RESPONSE_SUGGEST_PERFORMANCE_PERFORMER';
export const REQUEST_ADD_PERFORMANCE_PERFORMER = 'REQUEST_ADD_PERFORMANCE_PERFORMER';
export const REQUEST_DELETE_PERFORMANCE_PERFORMER = 'REQUEST_DELETE_PERFORMANCE_PERFORMER';
export const REQUEST_DELETE_PERFORMANCE_CATEGORY = 'REQUEST_DELETE_PERFORMANCE_CATEGORY';
export const REQUEST_PERFORMANCE_MAKEABOUTPRIMARY = 'REQUEST_PERFORMANCE_MAKEABOUTPRIMARY';
export const REQUEST_PERFORMANCE_EDITABOUT = 'REQUEST_PERFORMANCE_EDITABOUT';
export const REQUEST_PERFORMANCE_DELETEABOUT = 'REQUEST_PERFORMANCE_DELETEABOUT';
export const REQUEST_ADD_PERFORMANCE_CATEGORY='REQUEST_ADD_PERFORMANCE_CATEGORY';

// Wrap fetch with some default settings, always
// return parsed JSON…
const fetch = (path, options = {}, json = true) => {
  console.log('4 ACTION fetch, path:' + path);
  const opts = Object.assign({}, {
    credentials: 'same-origin'
  }, options);
  if (json === true) {
    opts.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
  return isomorphicFetch(path, opts)
    .then(response => response.json());
};

export function navigate(active) {
  console.log('navigate(active):' + JSON.stringify(active));
  return { type: NAVIGATE, active };
}

export function crewNavigate(active) {
  console.log('crewNavigate(active):' + JSON.stringify(active));
  return { type: CREW_NAVIGATE, active };
}

export function performanceNavigate(active) {
  console.log('performanceNavigate(active):' + JSON.stringify(active));
  return { type: PERFORMANCE_NAVIGATE, active };
}

export function eventNavigate(active) {
  console.log('eventNavigate(active):' + JSON.stringify(active));
  return { type: EVENT_NAVIGATE, active };
}

export function gotUser(json) {
  console.log('5 ACTION gotUser');
  return { type: GOT_USER, json };
}

export function fetchUser() {
  return dispatch => {
    console.log('3 ACTION fetchUser');
    return fetch('/account/api/user')
      .then(json => dispatch(gotUser(json)));
  };
}
export function addEventCategory(id, category) {
  return dispatch => {
    console.log('_______________ACTION addEventCategory __________________________________');
    console.log('addEventCategory id: ' + id + 'category: ' + category);
    dispatch({
      type: REQUEST_ADD_EVENT_CATEGORY,
      payload: {
        eventid: id,
        category: category
      }
    });
    return fetch(
      `/account/api/event/${id}/category/${category}`, {
        method: 'PUT'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventCategory(dispatch) {
  return (eventId, categoryId) => {
    console.log('_______________ACTION removeEventCategory __________________________________');
    console.log('removeEventCategory eventId: ' + eventId + ' categoryId: ' + categoryId);
    dispatch({
      type: REQUEST_DELETE_EVENT_CATEGORY,
      payload: {
        eventId: eventId,
        categoryId: categoryId
      }
    });
    return fetch(`/account/api/event/${eventId}/category/${categoryId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editEvent(dispatch) {
  return data => {
    console.log('_______________ACTION editEvent __________________________________');
    console.log('editEvent data._id: ' + JSON.stringify(data._id));
    dispatch({
      type: REQUEST_EDIT_EVENT,
      id: data._id
    });
    return fetch(
      `/account/api/event/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addEvent(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT
    });
    return fetch(
      '/account/api/event', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deleteEvent(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT,
      id
    });
    return fetch(
      `/account/api/event/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addEventImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENTIMAGE,
      payload: {
        eventId: id
      }
    });
    return fetch(`/account/api/event/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addEventTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENTTEASERIMAGE,
      payload: {
        eventId: id
      }
    });
    return fetch(`/account/api/event/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventPerformance(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_PERFORMANCE,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/performance?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_PERFORMANCE,
          suggestions: json
        });
      });
  };
}

export function addEventPerformance(eventId, performanceId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_PERFORMANCE
    });
    return fetch(`/account/api/event/${eventId}/performance/${performanceId}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventPerformance(eventId, performanceId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_PERFORMANCE,
      payload: {
        eventId,
        performanceId
      }
    });
    return fetch(`/account/api/event/${eventId}/performance/${performanceId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventOrganizer(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_ORGANIZER,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_ORGANIZER,
          suggestions: json
        });
      });
  };
}

export function addEventOrganizer(eventId, organizerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_ORGANIZER
    });
    return fetch(`/account/api/event/${eventId}/organizer/${organizerId}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventOrganizer(eventId, organizerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_ORGANIZER,
      payload: {
        eventId,
        organizerId
      }
    });
    return fetch(`/account/api/event/${eventId}/organizer/${organizerId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestEventOrganizingCrew(eventId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_EVENT_ORGANIZINGCREW,
      payload: {
        q,
        eventId
      }
    });
    return fetch(`/account/api/search/crew?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_EVENT_ORGANIZINGCREW,
          suggestions: json
        });
      });
  };
}

export function crewAboutDelete(dispatch) {
  return (crewId, aboutlanguage) => {
    console.log('_______________ACTION crewAboutDelete __________________________________');
    console.log('crewAboutDelete aboutlanguage: ' + JSON.stringify(aboutlanguage));
    dispatch({
      type: REQUEST_CREW_DELETEABOUT,
      payload: {
        crew: crewId,
        aboutlanguage: aboutlanguage
      }
    });
    return fetch(`/account/api/crew/${crewId}/about/${aboutlanguage}`, {
      method: 'DELETE',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function addEventOrganizingCrew(eventId, organizingCrewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_EVENT_ORGANIZINGCREW
    });
    return fetch(`/account/api/event/${eventId}/organizingcrew/${organizingCrewId}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventOrganizingCrew(eventId, organizingCrewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_EVENT_ORGANIZINGCREW,
      payload: {
        eventId,
        organizingCrewId
      }
    });
    return fetch(`/account/api/event/${eventId}/organizingcrew/${organizingCrewId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addCrew(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREW
    });
    return fetch(
      '/account/api/crew', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deleteCrew(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_CREW,
      id
    });
    return fetch(
      `/account/api/crew/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editCrew(dispatch) {
  return data => {
    console.log('_______________ACTION editCrew __________________________________');
    console.log('editCrew data._id: ' + JSON.stringify(data._id));
  /* if (data._id) {
    // about, verify unique
    if (data.about) {
      let aboutFound = false;
      // init if first about
      if (!data.abouts) data.abouts = [];
      // check existing abouts
      data.abouts.map((a) => {
        if (a.lang === data.aboutlanguage) {
          // about in the form already exists in abouts
          aboutFound = true;
          // update abouttext
          a.abouttext = data.about;
        }
      });
      // in case of new about, add it to the abouts
      if (!aboutFound) {
        if (!data.aboutlanguage) data.aboutlanguage = 'en';
        data.abouts.push({
          lang: data.aboutlanguage,
          abouttext: data.about
        });
      }
    }
    return dispatch => {
      dispatch({
        type: REQUEST_EDIT_CREW,
        id: data._id
      });
      return fetch(
        `/account/api/crew/${data._id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        })
        .then(json => dispatch(gotUser(json)));
    };
  } */
    dispatch({
      type: REQUEST_EDIT_CREW,
      id: data._id
    });
    return fetch(
      `/account/api/crew/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestCrewMember(crewId, q) {
  const action = `actions, suggestCrewMember(crewId: ${crewId}, q: ${q}`;
  return dispatch => {
    console.log('_______________ACTION suggestCrewMember __________________________________');
    console.log(`${action}, q: ${q}`);
    dispatch({
      type: REQUEST_SUGGEST_CREWMEMBER,
      payload: {
        q,
        crewId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_CREWMEMBER,
          suggestions: json
        });
      });
  };
}

export function addCrewMember(crewId, member) {
  //const action = `actions, addCrewMember(crewId: ${crewId}`;

  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWMEMBER
    });
    return fetch(`/account/api/crew/${crewId}/member/${member.id}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeCrewMember(crewId, member) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_CREWMEMBER,
      payload: {
        crewId,
        memberId: member._id
      }
    });
    return fetch(`/account/api/crew/${crewId}/member/${member._id}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addCrewImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWIMAGE,
      payload: {
        crewId: id
      }
    });
    return fetch(`/account/api/crew/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addCrewTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWTEASERIMAGE,
      payload: {
        crewId: id
      }
    });
    return fetch(`/account/api/crew/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addOrgLogoImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_CREWORGLOGO,
      payload: {
        crewId: id
      }
    });
    return fetch(`/account/api/crew/${id}/orglogo`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function addPerformance(title) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE
    });
    return fetch(
      '/account/api/performance', {
        method: 'POST',
        body: JSON.stringify({ title })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function deletePerformance(id) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE,
      id
    });
    return fetch(
      `/account/api/performance/${id}`, {
        method: 'DELETE',
      })
      .then(json => dispatch(gotUser(json)));
  };
}
export function aboutPerformanceMakePrimary(dispatch) {
  return (userId, perfId, aboutId) => {
    console.log('aboutPerformanceMakePrimary userId: ' + userId + ' perfid: ' + perfid + ' aboutid: ' + aboutId);
    dispatch({
      type: REQUEST_PERFORMANCE_MAKEABOUTPRIMARY,
      payload: {
        performance: perfId,
        user: userId,
        about: aboutId
      }
    });
    return fetch(`/account/api/performance/${performance}/user/${user}/about/${aboutId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function editPerformance(dispatch) {
  // about, verify unique
  /* if (data.about) {
    let aboutFound = false;
    // init if first about
    if (!data.abouts) data.abouts = [];
    // check existing abouts
    data.abouts.map((a) => {
      if (a.lang === data.aboutlanguage) {
        // about in the form already exists in abouts
        aboutFound = true;
        // update abouttext
        a.abouttext = data.about;
      }
    });
    // in case of new about, add it to the abouts
    if (!aboutFound) {
      if (!data.aboutlanguage) data.aboutlanguage = 'en';
      data.abouts.push({
        lang: data.aboutlanguage,
        abouttext: data.about
      });
    }
  }
  // category, verify unique
  if (data.category) {
    let categoryFound = false;
    data.categories.map((c) => {
      if (c.name === data.category) {
        // name in the form already exists in categories
        categoryFound = true;
      }
    });
    // in case of new category, add it to the categories
    if (!categoryFound) {
      data.categories.push({
        name: data.category
      });
    }
  }
  return dispatch => {
    dispatch({
      type: REQUEST_EDIT_PERFORMANCE,
      id: data._id
    });
    return fetch(
      `/account/api/performance/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  }; */
  return data => {
    console.log('_______________ACTION editPerformance __________________________________');
    console.log('editPerformance data._id: ' + JSON.stringify(data._id));
    dispatch({
      type: REQUEST_EDIT_PERFORMANCE,
      id: data._id
    });
    return fetch(
      `/account/api/performance/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}
export function performanceAboutEdit(id, aboutlanguage) {
  return dispatch => {
    console.log('_______________ACTION performanceAboutEdit __________________________________');
    console.log('performanceAboutEdit aboutlanguage: ' + JSON.stringify(aboutlanguage));
    dispatch({
      type: REQUEST_PERFORMANCE_EDITABOUT,
      payload: {
        performance: id,
        aboutlanguage: aboutlanguage
      }
    });
    return fetch(`/account/api/performance/${id}/about/${aboutlanguage}`, {
      method: 'PUT'
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function performanceAboutDelete(dispatch) {
  return (perfId, aboutlanguage) => {
    console.log('_______________ACTION performanceAboutDelete __________________________________');
    console.log('performanceAboutDelete aboutlanguage: ' + JSON.stringify(aboutlanguage));
    dispatch({
      type: REQUEST_PERFORMANCE_DELETEABOUT,
      payload: {
        performance: perfId,
        aboutlanguage: aboutlanguage
      }
    });
    return fetch(`/account/api/performance/${perfId}/about/${aboutlanguage}`, {
      method: 'DELETE',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
// BL FIXME REQUEST_EVENT_DELETEABOUT not defined
export function eventAboutDelete(dispatch) {
  return (eventId, aboutlanguage) => {
    console.log('_______________ACTION eventAboutDelete __________________________________');
    console.log('eventAboutDelete aboutlanguage: ' + JSON.stringify(aboutlanguage));
    dispatch({
      type: REQUEST_EVENT_DELETEABOUT,
      payload: {
        event: eventId,
        aboutlanguage: aboutlanguage
      }
    });
    return fetch(`/account/api/event/${eventId}/about/${aboutlanguage}`, {
      method: 'DELETE',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function editPerformanceAbouts(data) {
  // about, verify unique
  if (data.about) {
    let aboutFound = false;
    let primaryAbout = true;
    // init if first about
    if (!data.abouts) data.abouts = [];
    // check existing abouts
    data.abouts.map((a) => {
      primaryAbout = false;
      if (a.lang === data.aboutlanguage) {
        // about in the form already exists in abouts
        aboutFound = true;
        // update abouttext
        a.abouttext = data.about;
      }
    });
    // in case of new about, add it to the abouts
    if (!aboutFound) {
      if (!data.aboutlanguage) data.aboutlanguage = 'en';
      data.abouts.push({
        is_primary: primaryAbout,
        lang: data.aboutlanguage,
        abouttext: data.about
      });
    }
  }

  return dispatch => {
    dispatch({
      type: REQUEST_EDIT_PERFORMANCEABOUTS,
      id: data._id
    });
    return fetch(
      `/account/api/performance/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCEIMAGE,
      payload: {
        performanceId: id
      }
    });
    return fetch(`/account/api/performance/${id}/image`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceTeaserImage(id, file) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCETEASERIMAGE,
      payload: {
        performanceId: id
      }
    });
    return fetch(`/account/api/performance/${id}/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addPerformanceVideo({ _id, video }) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCEVIDEO,
      payload: {
        performanceId: _id,
        video: video
      }
    });
    return fetch(`/account/api/performance/${_id}/video`, {
      method: 'POST',
      body: JSON.stringify({ video })
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestPerformanceCrew(performanceId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_PERFORMANCE_CREW,
      payload: {
        q,
        performanceId
      }
    });
    return fetch(`/account/api/search/crew?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_PERFORMANCE_CREW,
          suggestions: json
        });
      });
  };
}

export function addPerformanceCrew(performanceId, crewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE_CREW
    });
    return fetch(`/account/api/performance/${performanceId}/crew/${crewId}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removePerformanceCrew(performanceId, crewId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE_CREW,
      payload: {
        performanceId,
        crewId
      }
    });
    return fetch(`/account/api/performance/${performanceId}/crew/${crewId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}
export function addPerformanceCategory(id, category) {
  return dispatch => {
    console.log('_______________ACTION addPerformanceCategory __________________________________');
    console.log('addPerformanceCategory id: ' + id + 'category: ' + category);
    dispatch({
      type: REQUEST_ADD_PERFORMANCE_CATEGORY,
      payload: {
        performanceId: id,
        category: category
      }
    });
    return fetch(
      `/account/api/performance/${id}/category/${category}`, {
        method: 'PUT'
      })
      .then(json => dispatch(gotUser(json)));
  };
}
export function removePerformanceCategory(dispatch) {
  return (performanceId, categoryId) => {
    console.log('_______________ACTION removePerformanceCategory __________________________________');
    console.log('removePerformanceCategory performanceId: ' + performanceId + 'categoryId: ' + categoryId);
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE_CATEGORY,
      payload: {
        performanceId: performanceId,
        categoryId: categoryId
      }
    });
    return fetch(`/account/api/performance/${performanceId}/category/${categoryId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function suggestPerformancePerformer(performanceId, q) {
  return dispatch => {
    dispatch({
      type: REQUEST_SUGGEST_PERFORMANCE_PERFORMER,
      payload: {
        q,
        performanceId
      }
    });
    return fetch(`/account/api/search/user?q=${q}`)
      .then(json => {
        dispatch({
          type: RESPONSE_SUGGEST_PERFORMANCE_PERFORMER,
          suggestions: json
        });
      });
  };
}

export function addPerformancePerformer(performanceId, performerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_ADD_PERFORMANCE_PERFORMER
    });
    return fetch(`/account/api/performance/${performanceId}/performer/${performerId}`, {
      method: 'PUT',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removePerformancePerformer(performanceId, performerId) {
  return dispatch => {
    dispatch({
      type: REQUEST_DELETE_PERFORMANCE_PERFORMER,
      payload: {
        performanceId,
        performerId
      }
    });
    return fetch(`/account/api/performance/${performanceId}/performer/${performerId}`, {
      method: 'DELETE',
    })
      .then(json => dispatch(gotUser(json)));
  };
}

export function openStagenameModal(dispatch) {
  return () => (
    dispatch({
      type: OPEN_STAGENAME_MODAL
    })
  );
}

export function closeStagenameModal(dispatch) {
  return () => (
    dispatch({
      type: CLOSE_STAGENAME_MODAL
    })
  );
}

export function openPasswordModal(dispatch) {
  return () => (
    dispatch({
      type: OPEN_PASSWORD_MODAL
    })
  );
}

export function closePasswordModal(dispatch) {
  return () => (
    dispatch({
      type: CLOSE_PASSWORD_MODAL
    })
  );
}

const wrapInFormData = (file) => {
  const formData = new FormData();
  formData.append('image', file, file.name);
  return formData;
};

export function addUserProfileImage(dispatch) {
  return (id, file) => {
    console.log('______ ACTION addUserProfileImage _______');
    console.log('id: ' + id + ' file: ' + JSON.stringify(file));
    dispatch({
      type: REQUEST_ADD_USERPROFILEIMAGE,
      payload: {
        user: id
      }
    });
    return fetch(`/account/api/user/${id}/image/profile`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function addUserTeaserImage(dispatch) {
  return (id, file) => {
    dispatch({
      type: REQUEST_ADD_USERTEASERIMAGE,
      payload: {
        user: id
      }
    });
    return fetch(`/account/api/user/${id}/image/teaser`, {
      method: 'POST',
      body: wrapInFormData(file)
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function userEmailMakePrimary(dispatch) {
  return (userId, emailIndex) => {
    console.log(userId + ' emailId: ' + emailIndex);
    dispatch({
      type: REQUEST_USER_MAKEEMAILPRIMARY,
      payload: {
        user: userId,
        email: emailIndex
      }
    });
    return fetch(`/account/api/user/${userId}/email/${emailIndex}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userEmailTogglePrivacy(dispatch) {
  return (userId, emailIndex) => {
    dispatch({
      type: REQUEST_USER_TOGGLEPRIVACY,
      payload: {
        user: userId,
        email: emailIndex
      }
    });
    return fetch(`/account/api/user/${userId}/toggleprivacy/${emailIndex}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
/*export function userEmailMakePrivate(dispatch) {
  return (userId, emailIndex) => {
    dispatch({
      type: REQUEST_USER_MAKEEMAILPRIVATE,
      payload: {
        user: userId,
        email: emailIndex
      }
    });
    return fetch(`/account/api/user/${userId}/makeemailprivate/${emailIndex}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userEmailMakePublic(dispatch) {
  return (userId, emailIndex) => {
    dispatch({
      type: REQUEST_USER_MAKEEMAILPUBLIC,
      payload: {
        user: userId,
        email: emailIndex
      }
    });
    return fetch(`/account/api/user/${userId}/makeemailpublic/${emailIndex}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
} */
export function userEmailConfirm(dispatch) {
  return (userId, emailIndex) => {
    console.log('_______________ACTION userEmailConfirm __________________________________');
    console.log('userEmailConfirm : ' + userId + ' ' + emailIndex);
    dispatch({
      type: REQUEST_USER_EMAILCONFIRM,
      payload: {
        user: userId,
        email: emailIndex
      }
    });
    return fetch(`/account/api/user/${userId}/emailconfirm/${emailIndex}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userEmailDelete(dispatch) {
  return (userId, emailId) => {
    dispatch({
      type: REQUEST_USER_DELETEEMAIL,
      payload: {
        user: userId,
        email: emailId
      }
    });
    return fetch(
      `/account/api/user/${userId}/email/${emailId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editUser(dispatch) {
  return data => {
    let str = JSON.stringify(data);
    console.log('_______________ ACTION editUser __________________________________');
    console.log('editUser data length: ' + str.length);
    console.log('editUser links: ' + JSON.stringify(data.links));
  
    dispatch({
      type: REQUEST_EDIT_USER,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editUserEmails(dispatch) {
  return data => {
    // fetch user before updating to check for email change
    let emailFound = false;
    data.emails.map((m) => {
      if (m.email === data.email) {
        // email in the form already exists in emails
        emailFound = true;
      }
    });
    // in case of new email, add it to the emails
    if (!emailFound) {
      data.emails.push({
        email: data.email,
        is_primary: false,
        is_confirmed: false
      });
      // BL FIXME send confirmation email in another part of the app
    }
    // end email add

    dispatch({
      type: REQUEST_EDIT_USER,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}
// User Addresses

export function userAddressMakePrimary(dispatch) {
  return (userId, addressId) => {
    dispatch({
      type: REQUEST_USER_MAKEADDRESSPRIMARY,
      payload: {
        user: userId,
        address: addressId
      }
    });
    return fetch(`/account/api/user/${userId}/address/${addressId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userAddressMakePrivate(dispatch) {
  return (userId, addressId) => {
    dispatch({
      type: REQUEST_USER_MAKEADDRESSPRIVATE,
      payload: {
        user: userId,
        address: addressId
      }
    });
    return fetch(`/account/api/user/${userId}/makeaddressprivate/${addressId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userAddressMakePublic(dispatch) {
  return (userId, addressId) => {
    dispatch({
      type: REQUEST_USER_MAKEADDRESSPUBLIC,
      payload: {
        user: userId,
        address: addressId
      }
    });
    return fetch(`/account/api/user/${userId}/makeaddresspublic/${addressId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userAddressDelete(dispatch) {
  return (userId, addressId) => {
    dispatch({
      type: REQUEST_USER_DELETEADDRESS,
      payload: {
        user: userId,
        address: addressId
      }
    });
    return fetch(
      `/account/api/user/${userId}/address/${addressId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function addPlace(dispatch) {
  return (id, location) => {
    dispatch({
      type: REQUEST_ADD_USER_PLACE,
      payload: {
        user: id,
        location: location
      }
    });
    return fetch(
      '/account/api/user/place', {
        method: 'POST',
        body: JSON.stringify({ id, location })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editUserAddresses(dispatch) {
  return data => {

    // fetch user before updating to check if unique address
    let addressFound = false;
    let primaryAddress = true;
    let inputAddress = data.street_number + ', ' + data.route + ', ' + data.locality + ', ' + data.country;
    console.log('_______________ ACTION editUserAddresses __________________________________');
    console.log('editUserAddresses data id: ' + data._id);
    console.log('editUserAddresses data street_number: ' + data.street_number);
    console.log('editUserAddresses data route: ' + data.route);
    console.log('editUserAddresses data administrative_area_level_1: ' + data.administrative_area_level_1);
    console.log('editUserAddresses data locality: ' + data.locality);
    console.log('editUserAddresses data country: ' + data.country);

    // init if first address
    if (!data.addresses) data.addresses = [];
    data.addresses.map((a) => {
      // if an address exist, new ones are not set to primary (for now)
      primaryAddress = false;
      if (a.address === inputAddress) {
        // address in the form already exists in addresses
        addressFound = true;
        // update the fields
        /* BL FIXME user is not defined
        user.street_number = data.street_number;
        user.route = data.route;
        user.postal_code = data.postal_code;
        user.locality = data.locality;
        user.administrative_area_level_1 = data.administrative_area_level_1;
        user.country = data.country; */
      }
    });
    if (!addressFound) {
      // verify data.location is valid and lat lng found
      if (inputAddress) {// && data.location && data.location.geometry) {
        // add the address to the array
        data.addresses.push({
          address: inputAddress, // BL gmap response formatted_address, should be unique
          street_number: data.street_number,
          route: data.route,
          postal_code: data.postal_code,
          locality: data.locality,
          administrative_area_level_1: data.administrative_area_level_1,
          country: data.country,
          geometry: (data.location && data.location.geometry) ? data.location.geometry : {},
          place_id: (data.location && data.location.place_id) ? data.location.place_id : '',
          is_primary: primaryAddress // only first address is primary for now
        });
      }
    }

    dispatch({
      type: REQUEST_EDIT_USER,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function userAboutDelete(dispatch) {
  return (userId, aboutlanguage) => {
    console.log('_______________ACTION userAboutDelete __________________________________');
    console.log('userAboutDelete userId: ' + JSON.stringify(userId));
    console.log('userAboutDelete aboutlanguage: ' + JSON.stringify(aboutlanguage));

    dispatch({
      type: REQUEST_USER_DELETEABOUT,
      payload: {
        user: userId,
        aboutlanguage: aboutlanguage
      }
    });
    return fetch(
      `/account/api/user/${userId}/about/${aboutlanguage}`, {
        method: 'DELETE'
      }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function editUserImages(dispatch) {
  return data => {
    dispatch({
      type: REQUEST_EDIT_USERIMAGES,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function editUserLinks(dispatch) {
  return data => {
    console.log('_______________ACTION editUserLinks __________________________________');
    console.log('editUserLinks type: ' + JSON.stringify(data.linkType));

    dispatch({
      type: REQUEST_EDIT_USERLINKS,
      id: data._id
    });
    return fetch(
      `/account/api/user/${data._id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function changeLanguage(dispatch) {
  // BL FIXME on loading Prefs page, should show this language in the DL
  return (language, userid) => {
    // console.log('changeLanguage lng: ' + JSON.stringify(language) );
    // console.log('changeLanguage user: ' + JSON.stringify(userid) );
    dispatch({
      type: CHANGE_LANGUAGE,
      payload: {
        language
      }
    });
    return fetch(
      `/account/api/user/${userid}/language/${language}`, {
        method: 'PUT'
      }).then(json => dispatch(gotUser(json)));
  };
}
// linktypes
export function fetchLinkTypes(dispatch) {
  return () => {
    return fetch('/account/api/linktypes')
      .then(json => (
        dispatch({
          type: RESPONSE_LINKTYPES,
          payload: {
            linktypes: json
          }
        })
      ));
  };
}
// countries
export function fetchCountries(dispatch) {
  return () => {
    return fetch('/account/api/countries')
      .then(json => (
        dispatch({
          type: RESPONSE_COUNTRIES,
          payload: {
            countries: json
          }
        })
      ));
  };
}
// venues
export function addEventVenue(dispatch) {
  return (id, location) => {
    dispatch({
      type: REQUEST_ADD_EVENT_VENUE,
      payload: {
        event: id,
        location: location
      }
    });
    //console.log('addEventVenue, event:' + id + ' location:' + JSON.stringify(location) );
    return fetch(
      '/account/api/event/venue', {
        method: 'POST',
        body: JSON.stringify({ id, location })
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function removeEventVenue(dispatch) {
  return (eventId, venueId) => {
    dispatch({
      type: REQUEST_DELETE_EVENT_VENUE,
      payload: {
        event: eventId,
        venue: venueId
      }
    });
    return fetch(
      `/account/api/event/${eventId}/venue/${venueId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

// Links
export function userLinkAdd(dispatch) {
  return (id, link) => {
    dispatch({
      type: REQUEST_ADD_USER_LINK,
      payload: {
        user: id,
        link: link
      }
    });
    return fetch(
      '/account/api/user/link', {
        method: 'POST',
        body: JSON.stringify({ id, link })
      })
      .then(json => dispatch(gotUser(json)));
  };
}
/*
export function userLinkEdit(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_EDITLINK,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(`/account/api/user/${userId}/link/${linkId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}

export function userLinkMakePrimary(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_MAKELINKPRIMARY,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(`/account/api/user/${userId}/link/${linkId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userLinkMakePrivate(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_MAKELINKPRIVATE,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(`/account/api/user/${userId}/makelinkprivate/${linkId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userLinkMakePublic(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_MAKELINKPUBLIC,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(`/account/api/user/${userId}/makelinkpublic/${linkId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
}
export function userLinkConfirm(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_LINKCONFIRM,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(`/account/api/user/${userId}/linkconfirm/${linkId}`, {
      method: 'PUT',
    }, false)
      .then(json => dispatch(gotUser(json)));
  };
} */
export function eventLinkDelete(dispatch) {
  return (eventId, linkId) => {
    dispatch({
      type: REQUEST_USER_DELETELINK,
      payload: {
        event: eventId,
        link: linkId
      }
    });
    return fetch(
      `/account/api/event/${eventId}/link/${linkId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

export function userLinkDelete(dispatch) {
  return (userId, linkId) => {
    dispatch({
      type: REQUEST_USER_DELETELINK,
      payload: {
        user: userId,
        link: linkId
      }
    });
    return fetch(
      `/account/api/user/${userId}/link/${linkId}`, {
        method: 'DELETE'
      })
      .then(json => dispatch(gotUser(json)));
  };
}

