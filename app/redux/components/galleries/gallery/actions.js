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
    request: api.fetchGalleriesMedia,
    schema: galleries,
    id
  });

  export const uploadModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveGalleriesMedia,
    schema: galleries,
    model
  });

  export const removeImage = data =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeGalleriesMedia,
    schema: galleries,
    data
  });