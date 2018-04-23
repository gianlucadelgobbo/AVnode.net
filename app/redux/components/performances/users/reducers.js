import {FETCH_USERS_ERROR, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS} from '../constants';
import create from '../../reducers/byIdAndListCreator'
import {MODELS_NAME} from '../constants'


export default create({
    MODELS_NAME,
    FETCH_USERS_ERROR,
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS
});