import * as api from "../../../api";
import { footage } from "../schema";
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
    request: api.fetchFootagePublic,
    schema: footage,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveFootagePublic,
    schema: footage,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeFootagePublic,
    schema: footage,
    model
  });
