import * as api from '../../api';
import {arrayOfPerformance, performance} from './schema'
import {
    fetchList as generateFetchList,
    saveModel as generateSaveModel,
    removeModel as generateRemoveModel
} from "../../actions";
import * as constants from "./constants";
import * as selectors from "./selectors";

export const fetchList = () => generateFetchList({
    selectors,
    constants,
    schema: arrayOfPerformance,
    request: api.fetchPerformances,
});

export const removeModel = ({id}) => () => generateRemoveModel({
    selectors,
    constants,
    schema: performance,
    request: api.removePerformance,
    id
});

export const saveModel = (model) => () => generateSaveModel({
    selectors,
    constants,
    schema: performance,
    request: api.postPerformance,
    model
});