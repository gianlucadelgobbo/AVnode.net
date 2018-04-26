import * as api from '../../../api';
import {arrayOfUsers} from './schema';
import {
        fetchList as generateFetchList,
        saveModel as generateSaveModel,
} from '../../../actions/';
import * as selectors from "./selectors";
import * as constants from './constants';

export const fetchList = () => generateFetchList({
    constants,
    selectors,
    schema: arrayOfUsers,
    request: api.fetchPerformanceUsers
});

export const saveModel = (model) =>  generateSaveModel({
    selectors,
    constants,
    request: api.savePerformanceUsers,
    schema: arrayOfUsers,
    model,
});