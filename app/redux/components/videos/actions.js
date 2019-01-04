import * as api from "../../api";
import { arrayOfVideos, videos } from "./schema";
import {
  fetchList as generateFetchList,
  saveModel as generateSaveModel,
  removeModel as generateRemoveModel
} from "../../actions";
import * as constants from "./constants";
import * as selectors from "./selectors";

export const fetchList = () =>
  generateFetchList({
    selectors,
    constants,
    schema: arrayOfVideos,
    request: api.fetchVideos
  });

export const removeModel = ({ id }) =>
  generateRemoveModel({
    selectors,
    constants,
    schema: videos,
    request: api.removeVideos,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    schema: videos,
    request: api.postVideos,
    model
  });
