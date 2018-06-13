import * as api from '../../../api';
import {signup} from './schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from './constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchProfilePublic,
    schema: signup,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.saveProfilePublic,
    schema: signup,
    model,
});
