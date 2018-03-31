import * as api from '../../api';
import {normalize} from 'normalizr';
import {FETCH_LIST_SUCCESS, FETCH_LIST_REQUEST, FETCH_LIST_ERROR} from './constants'
import {SAVE_MODEL_ERROR, SAVE_MODEL_REQUEST, SAVE_MODEL_SUCCESS} from './constants'
import {arrayOfCrew, crew} from './schema'

export const fetchList = () => (dispatch) => {

    dispatch({
        type: FETCH_LIST_REQUEST,
    });

    return api.fetchCrews()
        .then(
            (response) => {
                dispatch({
                    type: FETCH_LIST_SUCCESS,
                    response: normalize(response || [], arrayOfCrew)
                });
            },
            (error) => {
                dispatch({
                    type: FETCH_LIST_ERROR,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};

export const removeModel = ({id}) => (dispatch) => {

    dispatch({
        type: SAVE_MODEL_REQUEST,
        id
    });

    return api.removeCrew({id})
        .then(
            (response) => {
                dispatch({
                    type: SAVE_MODEL_SUCCESS,
                    id,
                    response: normalize(response || [], arrayOfCrew)
                });
            },
            (error) => {
                dispatch({
                    type: SAVE_MODEL_ERROR,
                    id,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};

export const saveModel = (model) => (dispatch) => {

    dispatch({
        type: SAVE_MODEL_REQUEST,
        id: model.id
    });

    return api.postCrew(model)
        .then(
            (response) => {
                dispatch({
                    type: SAVE_MODEL_SUCCESS,
                    response: normalize(response || [], crew)
                });
            },
            (error) => {
                dispatch({
                    type: SAVE_MODEL_ERROR,
                    errorMessage: error.message || 'Something went wrong.'
                });
            });
};