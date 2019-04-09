import * as api from "../../../api";
import { arrayOfUsers } from "./schema";
import { event } from "../schema";
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
    schema: event,
    request: api.fetchEventPublic
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveEventUsers,
    schema: event,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeEventUsers,
    schema: event,
    model
  });
