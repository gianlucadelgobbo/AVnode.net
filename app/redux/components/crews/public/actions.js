import * as api from '../../../api';
import {crew} from '../schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from '../constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchCrewPublic,
    schema: crew,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.saveCrewPublic,
    schema: crew,
    model,
});