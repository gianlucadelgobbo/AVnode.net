import * as api from "../../../api";
import { crew } from "../schema";
import {
  fetchModel as generateFetchModel,
  saveModel as generateSaveModel,
  removeModel as generateRemoveModel
} from "../../../actions";
import * as selectors from "../selectors";
import * as constants from "../constants";

export const fetchModel =  id  =>
  generateFetchModel({
    selectors,
    constants,
    request: api.fetchCrewMembers,
    schema: crew,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    request: api.saveCrewMembers,
    schema: crew,
    model
  });

export const removeModel = model =>
  generateRemoveModel({
    selectors,
    constants,
    request: api.removeCrewMembers,
    schema: crew,
    model
  });
