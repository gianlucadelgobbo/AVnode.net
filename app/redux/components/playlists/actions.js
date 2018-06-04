import * as api from '../../api';
import {arrayOfPlaylists, playlists} from './schema';
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
    schema: arrayOfPlaylists,
    request: api.fetchPlaylists,
});

export const removeModel = ({id}) => () => generateRemoveModel({
    selectors,
    constants,
    schema: arrayOfPlaylists,
    request: api.removePlaylists,
    id
});