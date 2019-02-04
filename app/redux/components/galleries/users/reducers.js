import {FETCH_LIST_SUCCESS, FETCH_LIST_ERROR, FETCH_LIST_REQUEST} from './constants';
import create from '../../../reducers/byIdAndListCreator'
import {MODELS_NAME} from './constants'


export default create({
    MODELS_NAME,
    FETCH_LIST_ERROR,
    FETCH_LIST_REQUEST,
    FETCH_LIST_SUCCESS
});