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

export const fetchCountries = () => {
    return axios.get('/user/countries')
        .then(result => {
            return result.data;
        });
};

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
    return axios.get("profile/images")
        .then(result => {
            return result.data;
        });
};

export const saveProfileImages = (model) => {
    return axios.get("profile/images", model)
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

// - emails

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
            return result.data;
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
