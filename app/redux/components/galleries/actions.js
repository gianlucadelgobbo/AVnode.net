import * as api from "../../api";
import { arrayOfGalleries, galleries } from "./schema";
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
    schema: arrayOfGalleries,
    request: api.fetchGalleries
  });

export const removeModel = ({ id }) =>
  generateRemoveModel({
    selectors,
    constants,
    schema: galleries,
    request: api.removeGalleries,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    schema: galleries,
    request: api.postGalleries,
    model
  });
