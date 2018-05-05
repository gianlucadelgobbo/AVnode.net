import * as api from '../../../api';
import {event} from '../schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from '../constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchEventGalleries,
    schema: event,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.saveEventGalleries,
    schema: event,
    model,
});

export const removeModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.removeEventGalleries,
    schema: event,
    model,
});