import * as api from "../../../api";
import { galleries } from "../schema";
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
    request: api.fetchGalleriesPublic,
    schema: galleries,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveGalleriesPublic,
    schema: galleries,
    model
  });

export const uploadModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveGalleriesMedia,
    schema: galleries,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeGalleriesPublic,
    schema: galleries,
    model
  });
