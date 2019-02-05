import * as api from "../../../api";
import { arrayOfUsers } from "./schema";
import { galleries } from "../schema";
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
    schema: performance,
    request: api.fetchPerformancePublic
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveGalleriesUsers,
    schema: galleries,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeGalleriesUsers,
    schema: galleries,
    model
  });
