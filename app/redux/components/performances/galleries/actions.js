import * as api from '../../../api';
import {performance} from '../schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel, removeModel as generateRemoveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from '../constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchPerformanceGalleries,
    schema: performance,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.savePerformanceGalleries,
    schema: performance,
    model,
});

export const removeModel = (model) => generateRemoveModel({
    selectors,
    constants,
    request: api.removePerformanceGalleries,
    schema: event,
    model,
});


