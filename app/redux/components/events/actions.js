import * as api from '../../api';
import {arrayOfEvent, event} from "./schema";
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
    schema: arrayOfEvent,
    request: api.fetchEvents,
});

export const removeModel = ({id}) => () => generateRemoveModel({
    selectors,
    constants,
    schema: event,
    request: api.removeEvent,
    id
});

export const saveModel = (model) => () => generateSaveModel({
    selectors,
    constants,
    schema: event,
    request: api.postEvent,
    model
});