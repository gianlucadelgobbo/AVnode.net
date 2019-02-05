import * as api from "../../../api";
import { arrayOfUsers } from "./schema";
import { videos } from "../schema";
import {
  fetchList as generateFetchList,
  saveModel as generateSaveModel,
  removeModel as generateRemoveModel
} from "../../../actions/";
import * as selectors from "./selectors";
import * as constants from "../constants";

export const fetchList = () =>
  generateFetchList({
    constants,
    selectors,
    schema: videos,
    request: api.fetchPerformancePublic
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveVideoUsers,
    schema: videos,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeVideoUsers,
    schema: videos,
    model
  });
