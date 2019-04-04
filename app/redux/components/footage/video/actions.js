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
    request: api.fetchFootageVideo,
    schema: footage,
    id
  });

export const uploadModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveFootageVideo,
    schema: footage,
    model
  });
