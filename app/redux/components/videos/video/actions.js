import * as api from "../../../api";
import { videos } from "../schema";
import {
  fetchModel as generateFetchModel,
  saveModel as generateSaveModel,
  removeModel as generateRemoveModel
} from "../../../actions";
import * as selectors from "../selectors";
import * as constants from "../constants";

export const fetchModel = ({ id } = {}) =>
  generateFetchModel({
    selectors,
    constants,
    request: api.fetchVideosVideo,
    schema: videos,
    id
  });

/* export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveVideosVideo,
    schema: videos,
    model
  }); */

export const uploadModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveVideosMedia,
    schema: videos,
    model
  });

/* export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeVideosVideo,
    schema: videos,
    model
  }); */
