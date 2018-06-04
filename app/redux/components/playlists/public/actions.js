import * as api from '../../../api';
import {playlists} from '../schema'
import {fetchModel as generateFetchModel, saveModel as generateSaveModel, removeModel as generateRemoveModel} from '../../../actions'
import * as selectors from "../selectors";
import * as constants from '../constants'

export const fetchModel = ({id} = {}) => generateFetchModel({
    selectors,
    constants,
    request: api.fetchPlaylistsPublic,
    schema: playlists,
    id
});

export const saveModel = (model) => generateSaveModel({
    selectors,
    constants,
    request: api.savePlaylistsPublic,
    schema: playlists,
    model,
});

export const removeModel = (model) => generateRemoveModel({
    selectors,
    constants,
    request: api.removePlaylistsPublic,
    schema: playlists,
    model,
});