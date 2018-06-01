import * as api from '../../api';
import {arrayOfFootage, footage} from './schema';
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
    schema: arrayOfFootage,
    request: api.fetchFootage,
});

export const removeModel = ({id}) => () => generateRemoveModel({
    selectors,
    constants,
    schema: arrayOfFootage,
    request: api.removeFootage,
    id
});

export const saveModel = (model) => () => generateSaveModel({
    selectors,
    constants,
    schema: arrayOfFootage,
    request: api.postFootage,
    model
});