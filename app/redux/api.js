/* Ajax requests go here */
import axios from "./conf/axios";

// ============ Profile

// - public
export const fetchProfilePublic = () => {
  return axios.get("profile/public").then(result => {
    return result.data;
  });
};

export const saveProfilePublic = model => {
  /*return new Promise((fulfil, reject) => {

          reject({
              message: "Bella pie!!! sono a riga 21 di api.js"
          })
      })*/

  return axios.put("profile/public", model).then(result => {
    return result.data;
  });
};

export const fetchSlug = slug => {
  return axios.get(`profile/public/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// - private

export const fetchProfilePrivate = () => {
  return axios.get("profile/private").then(result => {
    return result.data;
  });
};

export const saveProfilePrivate = model => {
  return axios.put("profile/private", model).then(result => {
    return result.data;
  });
};

// - images

export const fetchProfileImages = () => {
  return axios.get("profile/image").then(result => {
    return result.data;
  });
};

export const saveProfileImages = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("image", model.image);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios.put("profile/image", formBox, config).then(result => {
    return result.data;
  });
};

export const saveFootageVideo = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("media", model.video[0]);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios
    .put(`footage/${model.id}/media`, formBox, config)
    .then(result => {
      return result.data;
    });
};

// - emails

export const fetchProfileEmails = () => {
  return axios.get("profile/emails").then(result => {
    return result.data;
  });
};

export const saveProfileEmails = model => {
  return axios.put("profile/emails", model).then(result => {
    return result.data;
  });
};

// - connections

export const fetchProfileConnections = () => {
  return axios.get("profile/connections").then(result => {
    return result.data;
  });
};

export const saveProfileConnections = model => {
  return axios.get("profile/connections", model).then(result => {
    return result.data;
  });
};

// - password

export const fetchProfilePassword = () => {
  return axios.get("profile/password").then(result => {
    return result.data;
  });
};

export const saveProfilePassword = model => {
  return axios.put("profile/password", model).then(result => {
    return result.data;
  });
};

// ============ Events

export const fetchEvents = () => {
  return axios.get("events").then(result => {
    return result.data.events;
  });
};

export const removeEvent = ({ id }) => {
  return axios.delete(`events/${id}`).then(result => {
    return result.data;
  });
};

export const postEvent = obj => {
  return axios.post(`events/new`, obj).then(result => {
    return result.data;
  });
};

// - public

export const fetchEventPublic = ({ id }) => {
  return axios.get(`events/${id}/public`).then(result => {
    return result.data;
  });
};

export const saveEventPublic = model => {
  return axios.put(`events/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

// - images

export const fetchEventImages = ({ id }) => {
  return axios.get(`events/${id}/image`).then(result => {
    return result.data;
  });
};

export const saveEventImages = model => {
  return axios.post(`events/${model._id}/image`, model).then(result => {
    return result.data;
  });
};

// - users

export const fetchEventPartners = ({ id }) => {
  return axios.get(`events/${id}/partners`).then(result => {
    return result.data;
  });
};

export const addEventPartners = model => {
  return axios.post(`events/${model._id}/partners`, model).then(result => {
    return result.data;
  });
};

export const saveEventPartners = model => {
  return axios.post(`events/${model._id}/partners`, model).then(result => {
    return result.data;
  });
};

export const removeEventPartners = model => {
  return axios.delete(`events/${model._id}/partners`, model).then(result => {
    return result.data;
  });
};

// - program

export const fetchEventProgram = ({ id }) => {
  return axios.get(`events/${id}/program`).then(result => {
    return result.data;
  });
};

export const saveEventProgram = model => {
  return axios.post(`events/${model._id}/program`, model).then(result => {
    return result.data;
  });
};

// - galleries

export const fetchEventGalleries = ({ id }) => {
  return axios.get(`events/${id}/galleries`).then(result => {
    return result.data;
  });
};

export const saveEventGalleries = model => {
  return axios.post(`events/${model._id}/galleries`, model).then(result => {
    return result.data;
  });
};

export const removeEventGalleries = model => {
  return axios.delete(`events/${model._id}/galleries`, model).then(result => {
    return result.data;
  });
};

// - videos

export const fetchEventVideos = ({ id }) => {
  return axios.get(`events/${id}/videos`).then(result => {
    return result.data;
  });
};

export const saveEventVideos = model => {
  return axios.post(`events/${model._id}/videos`, model).then(result => {
    return result.data;
  });
};

export const removeEventVideos = model => {
  return axios.delete(`events/${model._id}/videos`, model).then(result => {
    return result.data;
  });
};

// - calls

export const fetchEventCalls = ({ id }) => {
  return axios.get(`events/${id}/calls`).then(result => {
    return result.data;
  });
};

export const saveEventCalls = model =>
  axios.post(`events/${model._id}/calls`, model);

// - settings

export const fetchEventSettings = ({ id }) => {
  return axios.get(`events/${id}/settings`).then(result => {
    return result.data;
  });
};

export const saveEventSettings = model =>
  axios.post(`events/${model._id}/settings`, model);

export const fetchUserForSelect = () => {
  return axios.get("performances").then(result => {
    return { options: result.data.performances };
  });
};

//Event Slug
export const fetchSlugNewEvent = slug => {
  return axios.get(`events/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// ============ Performances

export const fetchPerformances = () => {
  return axios.get("performances").then(result => {
    return result.data.performances;
  });
};

export const fetchPerformancesForSelect = () => {
  return axios.get("performances").then(result => {
    return { options: result.data.performances };
  });
};

export const removePerformance = ({ id }) => {
  return axios.delete(`performances/${id}`).then(result => {
    return result.data;
  });
};

export const postPerformance = obj => {
  return axios.post(`performances/new/`, obj).then(result => {
    return result.data;
  });
};

// - public

export const fetchPerformancePublic = ({ id }) => {
  return axios.get(`performances/${id}/public`).then(result => {
    return result.data;
  });
};

export const savePerformancePublic = model => {
  return axios.put(`performances/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const fetchSlugNewPerformance = slug => {
  return axios.get(`performances/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// - images

export const fetchPerformanceImages = ({ id }) => {
  return axios.get(`performances/${id}/image`).then(result => {
    return result.data;
  });
};

export const savePerformanceImages = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("image", model.image);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios
    .put(`performances/${model.id}/image`, formBox, config)
    .then(result => {
      return result.data;
    });
};
//axios.post(`performances/${model._id}/image`, model);

// - galleries

export const fetchPerformanceGalleries = ({ id }) => {
  return axios.get(`performances/${id}/galleries`).then(result => {
    return result.data;
  });
};

export const savePerformanceGalleries = model => {
  return axios
    .post(`performances/${model._id}/galleries`, model)
    .then(result => {
      return result.data;
    });
};

export const removePerformanceGalleries = model => {
  return axios
    .delete(`performances/${model._id}/galleries`, model)
    .then(result => {
      return result.data;
    });
};

// - videos

export const fetchPerformanceVideos = ({ id }) => {
  return axios.get(`performances/${id}/videos`).then(result => {
    return result.data;
  });
};

export const savePerformanceVideos = model =>
  axios.post(`performances/${model._id}/videos`, model).then(result => {
    return result.data;
  });

export const removePerformanceVideos = model => {
  return axios
    .delete(`performances/${model._id}/videos`, model)
    .then(result => {
      return result.data;
    });
};

// ============ Footage

export const fetchFootage = () => {
  return axios.get("footage").then(result => {
    return result.data.footage;
  });
};

export const removeFootage = ({ id }) => {
  return axios.delete(`footage/${id}`).then(result => {
    return result.data;
  });
};

export const postFootage = obj => {
  return axios.post(`footage/new/`, obj).then(result => {
    return result.data;
  });
};

// - public

export const fetchFootagePublic = ({ id }) => {
  return axios.get(`footage/${id}/public`).then(result => {
    return result.data;
  });
};

export const saveFootagePublic = model => {
  return axios.put(`footage/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const removeFootagePublic = model => {
  return axios.delete(`footage/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const fetchSlugNewFootage = slug => {
  return axios.get(`footage/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// ============ Playlist

export const fetchPlaylists = () => {
  return axios.get("playlists").then(result => {
    return result.data.playlists;
  });
};

export const removePlaylists = ({ id }) => {
  return axios.delete(`playlist/${id}`).then(result => {
    return result.data;
  });
};

// - public

export const fetchPlaylistsPublic = ({ id }) => {
  return axios.get(`playlists/${id}/public`).then(result => {
    return result.data;
  });
};

export const savePlaylistsPublic = model => {
  return axios.put(`playlists/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const removePlaylistsPublic = model => {
  return axios.delete(`playlists/${model._id}/public`, model).then(result => {
    return result.data;
  });
};
//Playlists Slug
export const fetchSlugNewPlaylist = slug => {
  return axios.get(`playlists/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};
// ============ Videos

export const fetchVideos = () => {
  return axios.get("videos").then(result => {
    return result.data.videos;
  });
};

export const removeVideos = ({ id }) => {
  return axios.delete(`videos/${id}`).then(result => {
    return result.data;
  });
};

export const postVideos = obj => {
  return axios.post(`videos/new/`, obj).then(result => {
    return result.data;
  });
};

// - public
export const fetchVideosPublic = ({ id }) => {
  return axios.get(`videos/${id}/public`).then(result => {
    return result.data;
  });
};

export const saveVideosPublic = model => {
  return axios.put(`videos/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const removeVideosPublic = model => {
  return axios.delete(`videos/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const saveVideosMedia = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("media", model.video[0]);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios.put(`videos/${model.id}/media`, formBox, config).then(result => {
    return result.data;
  });
};

export const fetchSlugNewVideos = slug => {
  return axios.get(`videos/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// ============ GALLERIES

export const fetchGalleries = () => {
  return axios.get("galleries").then(result => {
    return result.data.galleries;
  });
};

export const removeGalleries = ({ id }) => {
  return axios.delete(`galleries/${id}`).then(result => {
    return result.data;
  });
};

export const postGalleries = obj => {
  return axios.post(`galleries/new/`, obj).then(result => {
    return result.data;
  });
};

// - public
export const fetchGalleriesPublic = ({ id }) => {
  return axios.get(`galleries/${id}/public`).then(result => {
    return result.data;
  });
};

export const saveGalleriesPublic = model => {
  return axios.put(`galleries/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const removeGalleriesPublic = model => {
  return axios.delete(`galleries/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

export const saveGalleriesMedia = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("image", model);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios
    .put(`galleries/${model.id}/media`, formBox, config)
    .then(result => {
      return result.data;
    });
};

export const fetchSlugNewGalleries = slug => {
  return axios.get(`galleries/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};

// - users

export const fetchPerformanceUsers = () => {
  return new Promise(fulfil => {
    const items = [
      { value: "user-1", label: "User #1" },
      { value: "user-2", label: "User #2" },
      { value: "user-3", label: "User #3" },
      { value: "user-4", label: "User #4" },
      { value: "user-5", label: "User #5" },
      { value: "user-6", label: "User #6" },
      { value: "user-7", label: "User #7" }
    ];

    fulfil(items);
  });

  /*
      return axios.get(`performances/${id}/users`)
          .then(result => {
              return result.data;
          });
      */
};

/*export const savePerformanceUsers = model => (
  `performances/${model._id}/users`, model
);*/
export const savePerformanceUsers = model =>
  axios
    .get(`performances/${model._id}/users/add/${model.idusers}`, model)
    .then(result => {
      return result.data;
    });
// ============ Crews

export const fetchCrews = () => {
  return axios.get("crews").then(result => {
    return result.data.crews;
  });
};

export const removeCrew = ({ id }) => {
  return axios.delete(`crews/${id}`).then(result => {
    return result.data;
  });
};

export const postCrew = obj => {
  return axios.post(`crews/new/`, obj).then(result => {
    return result.data;
  });
};

// - public

export const fetchCrewPublic = ({ id }) => {
  return axios.get(`crews/${id}/public`).then(result => {
    return result.data;
  });
};

export const saveCrewPublic = model => {
  return axios.put(`crews/${model._id}/public`, model).then(result => {
    return result.data;
  });
};

/*
export const fetchSlugCrew = () => {
  return new Promise(fulfil => {
    const obj = {
      slug: "slug-1",
      exist: false
    };

    fulfil(obj);
  });
};
*/
export const fetchPerformanceCategory = () => {
  return new Promise(fulfil => {
    const obj = {
      type: "video-installation",
      genre: "jazz",
      technique: "generative"
    };

    fulfil(obj);
  });
};

export const fetchSlugSectionPublic = (section, id, slug) => {
  return axios.get(`${section}/${id}/public/slugs/${slug}`).then(result => {
    return result.data;
  });
};

export const fetchSlugNewCrew = slug => {
  return axios.get(`crews/new/slugs/${slug}`).then(result => {
    return result.data;
  });
};
// - images

export const fetchCrewImages = ({ id }) => {
  return axios.get(`crews/${id}/image`).then(result => {
    return result.data;
  });
};

export const saveCrewImages = model => {
  // convert image to Form Data
  let formBox = new FormData();
  formBox.append("image", model.image);

  // define request headers
  const config = { headers: { "Content-Type": "multipart/form-data" } };

  return axios.put(`crews/${model.id}/image`, formBox, config).then(result => {
    return result.data;
  });
};

// - members

export const fetchCrewMembers = ({ id }) => {
  return axios.get(`crews/${id}/members`).then(result => {
    return result.data;
  });
};

export const saveCrewMembers = model =>
  /*new Promise((fulfil, reject) => {
    reject({
      response: {
        data: {
          message: "Bella pie"
        }
      }
    });
  });*/
  axios
    .get(`crews/${model.id}/members/add/${model.idmember}`, model)
    .then(result => {
      return result.data;
    });

export const removeCrewMembers = model =>
  axios
    .get(`crews/${model.id}/members/remove/${model.idmember}`, model)
    .then(result => {
      return result.data;
    });

// - organization

export const fetchCrewOrganization = ({ id }) => {
  return axios.get(`crews/${id}/organization`).then(result => {
    return result.data;
  });
};

export const saveCrewOrganization = model => {
  return axios.get(`crews/${model._id}/organization`, model).then(result => {
    return result.data;
  });
};

// ============ CODE LISTS

// countries

export const fetchCountries = () => {
  return axios.get("/countries").then(result => {
    return result.data;
  });
};

// categories

export const fetchCategories = () => {
  return axios.get("/getcategories/performances/slug/type").then(result => {
    return result.data.children;
  });

  /*return new Promise(fulfil => {
    const items = [
      { _id: "5a9bba1760662400000000ce", name: "Festival" },
      { _id: "5a9bba176066240000000144", name: "CallOpen" },
      { _id: "5a9bba1760662400000001c3", name: "Gallery open" }
    ];

    fulfil(items);
  });*/
};

export const fetchPartnerCategories = () => {
  return new Promise(fulfil => {
    const items = [
      { _id: "5a9bba1760662400000000f5", name: "PRODUCTION" },
      {
        _id: "5a9bba1760662400000000d8",
        name: "CO-ORGANIZER"
      },
      { _id: "5a9bba17606624000000005a", name: "NETWORK EVENTS" },
      {
        _id: "5a9bba176066240000000076",
        name: "SUPPORTED BY"
      },
      { _id: "5a9bba176066240000000059", name: "APPROVED BY" },
      {
        _id: "5a9bba1760662400000000d7",
        name: "TECHNICAL PARTNERS"
      },
      { _id: "5a9bba176066240000000156", name: "LPM NETWORK" },
      {
        _id: "5a9bba176066240000000058",
        name: "TOP MEDIA PARTNERS"
      },
      { _id: "5a9bba1760662400000000d6", name: "Partner" }
    ];

    fulfil(items);
  });
  // return axios.get('/user/categories')
  //     .then(result => {
  //         return result.data;
  //     });
};

export const saveSignupPublic = model => axios.post(`signup`, model);

export const verifyEmail = ({ email }) =>
  axios.get(encodeURI(`profile/emails/verify/${email}`));

export const loadSuggestion = ({ value }) => axios.get(`getmembers/${value}`);

export const loadSuggestionAuthors = ({ value }) =>
  axios.get(`getauthors/${value}`);
