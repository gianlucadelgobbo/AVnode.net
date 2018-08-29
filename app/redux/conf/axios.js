import axios from 'axios'
//import LocalStorage from 'localStorage';

//const API_BASE_URL = process.env.APP_API_BASE_URL ;
const API_BASE_URL = "/admin/api/" ;

/**
 * Sets the default URL for API Calls
 * and sets fixed headers for JWT Auth
 * @type {[type]}
 */
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': ''
    }
});

export const setupInterceptors = (store) => {

    /**
     * Intercepts every request, before it goes out
     * @param  {[type]} config) {} [description]
     * @return {[type]}         [description]
     */
    axiosInstance.interceptors.request.use(function (config) {

        //const token = LocalStorage.getItem('token'); // TODO uncomment to include token in requests
        const token = null;

        if (token) {
            config.headers['Authorization'] = token
        }

        return config
    });

    axiosInstance.interceptors.response.use(function (response) {
        return response;
    }, function (error) {

        if (error.response.status === 401) {
            //LocalStorage.clear(); // TODO uncomment to clear token stored in LocalStorage on server error
        }

        // Do something with response error
        return Promise.reject(error);
    });

};

export default axiosInstance