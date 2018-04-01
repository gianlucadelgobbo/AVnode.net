import * as api from '../../api';
import {arrayOfCrew, crew} from './schema'
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
    schema: arrayOfCrew,
    request: api.fetchCrews,
});

export const removeModel = ({id}) => () => generateRemoveModel({
    selectors,
    constants,
    schema: crew,
    request: api.removeCrew,
    id
});

export const saveModel = (model) => () => generateSaveModel({
    selectors,
    constants,
    schema: crew,
    request: api.postCrew,
    model
});