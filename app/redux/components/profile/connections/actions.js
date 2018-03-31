import * as api from '../../../api';
import {normalize} from 'normalizr';
import {FETCH_MODEL_REQUEST, FETCH_MODEL_SUCCESS, FETCH_MODEL_ERROR} from '../constants'
import {SAVE_MODEL_REQUEST, SAVE_MODEL_SUCCESS, SAVE_MODEL_ERROR} from '../constants'
import {profile} from '../../../schemas/profile'

export const fetchModel = ({id} = {}) => (dispatch) => {

    dispatch({
        type: FETCH_MODEL_REQUEST,
        id
    });

    return api.fetchProfileConnections({id})
        .then(
            (response) => {
                dispatch({
                    type: FETCH_MODEL_SUCCESS,
                    response: normalize(response || [], profile)
                });
            },
            (error) => {
                dispatch({
                    type: FETCH_MODEL_ERROR,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};

export const saveModel = (model) => (dispatch) => {

    dispatch({
        type: SAVE_MODEL_REQUEST,
        id: model.id
    });

    return api.saveProfileConnections(model)
        .then(
            (response) => {
                dispatch({
                    type: SAVE_MODEL_SUCCESS,
                    response: normalize(response || [], profile)
                });
            },
            (error) => {
                dispatch({
                    type: SAVE_MODEL_ERROR,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};