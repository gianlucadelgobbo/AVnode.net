/* Ajax requests go here */
import axios from './conf/axios';

// ============ Profile

// - public
export const fetchProfilePublic = () => {
    return axios.get("profile/public")
        .then(result => {
            return result.data;
        });
};

export const saveProfilePublic = (model) => {
    return axios.get("profile/public", model)
        .then(result => {
            return result.data;
        });
};

export const fetchSlug = (slug) => {
    return axios.get(`profile/public/slugs/${slug}`)
        .then(result => {
            return result.data;
        });
};

// - private

export const fetchProfilePrivate = () => {
    return axios.get("profile/private")
        .then(result => {
            return result.data;
        });
};

export const saveProfilePrivate = (model) => {
    return axios.get("profile/private", model)
        .then(result => {
            return result.data;
        });
};

// - images

export const fetchProfileImages = () => {
    return axios.get("profile/image")
        .then(result => {
            return result.data;
        });
};

export const saveProfileImages = (model) => {
    console.log(model)
    return axios.put("profile/image", model)
        .then(result => {
            return result.data;
        });
};

// - emails

export const fetchProfileEmails = () => {
    return axios.get("profile/emails")
        .then(result => {
            return result.data;
        });
};

export const saveProfileEmails = (model) => {
    return axios.get("profile/emails", model)
        .then(result => {
            return result.data;
        });
};

// - connections

export const fetchProfileConnections = () => {
    return axios.get("profile/connections")
        .then(result => {
            return result.data;
        });
};

export const saveProfileConnections = (model) => {
    return axios.get("profile/connections", model)
        .then(result => {
            return result.data;
        });
};

// - password

export const fetchProfilePassword = () => {
    return axios.get("profile/password")
        .then(result => {
            return result.data;
        });
};

export const saveProfilePassword = (model) => {
    return axios.get("profile/password", model)
        .then(result => {
            return result.data;
        });
};


// ============ Events

export const fetchEvents = () => {
    return axios.get("events")
        .then(result => {
            return result.data.events;
        });
};

export const removeEvent = ({id}) => {
    return axios.delete(`events/${id}`)
        .then(result => {
            return result.data;
        });
};

export const postEvent = (obj) => {
    return axios.post(`events/`, obj)
        .then(result => {
            return result.data;
        });
};


// - public

export const fetchEventPublic = ({id}) => {
    return axios.get(`events/${id}/public`)
        .then(result => {
            return result.data;
        });
};

export const saveEventPublic = (model) => {
    return axios.get(`events/${model._id}/public`, model)
        .then(result => {
            return result.data;
        });
};

// - images

export const fetchEventImages = ({id}) => {
    return axios.get(`events/${id}/image`)
        .then(result => {
            return result.data;
        });
};

export const saveEventImages = (model) => {
    return axios.get(`events/${model._id}/image`, model)
        .then(result => {
            return result.data;
        });
};

// - users

export const fetchEventUsers = ({id}) => {
    return axios.get(`events/${id}/users`)
        .then(result => {
            return result.data;
        });
};

export const saveEventUsers = (model) => {
    return axios.get(`events/${model._id}/users`, model)
        .then(result => {
            return result.data;
        });
};

// - program

export const fetchEventProgram = ({id}) => {
    return axios.get(`events/${id}/program`)
        .then(result => {
            return result.data;
        });
};

export const saveEventProgram = (model) => {
    return axios.get(`events/${model._id}/program`, model)
        .then(result => {
            return result.data;
        });
};

// - galleries

export const fetchEventGalleries = ({id}) => {
    return axios.get(`events/${id}/galleries`)
        .then(result => {
            return result.data;
        });
};

export const saveEventGalleries = (model) => {
    return axios.get(`events/${model._id}/galleries`, model)
        .then(result => {
            return result.data;
        });
};

// - videos

export const fetchEventVideos = ({id}) => {
    return axios.get(`events/${id}/videos`)
        .then(result => {
            return result.data;
        });
};

export const saveEventVideso = (model) => {
    return axios.get(`events/${model._id}/videos`, model)
        .then(result => {
            return result.data;
        });
};


// - calls

export const fetchEventCalls = ({id}) => {
    return axios.get(`events/${id}/calls`)
        .then(result => {
            return result.data;
        });
};

export const saveEventCalls = (model) => {
    return axios.get(`events/${model._id}/calls`, model)
        .then(result => {
            return result.data;
        });
};

// - settings

export const fetchEventSettings = ({id}) => {
    return axios.get(`events/${id}/settings`)
        .then(result => {
            return result.data;
        });
};

export const saveEventSettings = (model) => {
    return axios.get(`events/${model._id}/settings`, model)
        .then(result => {
            return result.data;
        });
};

// ============ Performances

export const fetchPerformances = () => {
    return axios.get("performances")
        .then(result => {
            return result.data.performances;
        });
};

export const removePerformance = ({id}) => {
    return axios.delete(`performances/${id}`)
        .then(result => {
            return result.data;
        });
};

export const postPerformance = (obj) => {
    return axios.post(`performances/`, obj)
        .then(result => {
            return result.data;
        });
};


// - public

export const fetchPerformancePublic = ({id}) => {
    return axios.get(`performances/${id}/public`)
        .then(result => {
            return result.data;
        });
};

export const savePerformancePublic = (model) => {
    return axios.get(`performances/${model._id}/public`, model)
        .then(result => {
            return result.data;
        });
};

// - galleries

export const fetchPerformanceGalleries = ({id}) => {
    return axios.get(`performances/${id}/galleries`)
        .then(result => {
            return result.data;
        });
};

export const savePerformanceGalleries = (model) => {
    return axios.get(`performances/${model._id}/galleries`, model)
        .then(result => {
            return result.data;
        });
};

// - videos

export const fetchPerformanceVideos = ({id}) => {
    return axios.get(`performances/${id}/videos`)
        .then(result => {
            return result.data;
        });
};

export const savePerformanceVideos = (model) => {
    return axios.get(`performances/${model._id}/videos`, model)
        .then(result => {
            return result.data;
        });
};

// ============ Crews

export const fetchCrews = () => {
    return axios.get("crews")
        .then(result => {
            return result.data.crews;
        });
};

export const removeCrew = ({id}) => {
    return axios.delete(`crews/${id}`)
        .then(result => {
            return result.data;
        });
};

export const postCrew = (obj) => {
    return axios.post(`crews/`, obj)
        .then(result => {
            return result.data;
        });
};


// - public

export const fetchCrewPublic = ({id}) => {
    return axios.get(`crews/${id}/public`)
        .then(result => {
            return result.data;
        });
};

export const saveCrewPublic = (model) => {
    return axios.get(`crews/${model._id}/public`, model)
        .then(result => {
            return result.data;
        });
};


// - images

export const fetchCrewImages = ({id}) => {
    return axios.get(`crews/${id}/images`)
        .then(result => {
            return result.data;
        });
};

export const saveCrewImages = (model) => {
    return axios.get(`crews/${model._id}/images`, model)
        .then(result => {
            return result.data;
        });
};

// - members

export const fetchCrewMembers = ({id}) => {
    return axios.get(`crews/${id}/members`)
        .then(result => {
            return result.data;
        });
};

export const saveCrewMembers = (model) => {
    return axios.get(`crews/${model._id}/members`, model)
        .then(result => {
            return result.data;
        });
};

// - organization

export const fetchCrewOrganization = ({id}) => {
    return axios.get(`crews/${id}/organization`)
        .then(result => {
            return result.data;
        });
};

export const saveCrewOrganization = (model) => {
    return axios.get(`crews/${model._id}/organization`, model)
        .then(result => {
            return result.data;
        });
};


// ============ CODE LISTS

// countries

export const fetchCountries = () => {
    return axios.get('/user/countries')
        .then(result => {
            return result.data;
        });
};

// categories

export const fetchCategories = () => {

    return new Promise(fulfil => {
        const items = [
            {value: 'cat-1', label: 'Category #1'},
            {value: 'cat-2', label: 'Category #2'},
            {value: 'cat-3', label: 'Category #2'}
        ];

        fulfil(items);
    })

    // return axios.get('/user/categories')
    //     .then(result => {
    //         return result.data;
    //     });
};
