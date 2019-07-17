import * as api from "../../../api";
import { news } from "../schema";
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
    request: api.fetchNewsPublic,
    schema: news,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveNewsPublic,
    schema: news,
    model
  });

export const uploadModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveNewsVideo,
    schema: news,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeNewsPublic,
    schema: news,
    model
  });
