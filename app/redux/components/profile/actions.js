import * as api from "../../api";
import { profile } from "./schema";
import { fetchModel as generateFetchModel } from "../../actions";
import * as selectors from "./selectors";
import * as constants from "./constants";

export const fetchModel = ({ id } = {}) =>
  generateFetchModel({
    selectors,
    constants,
    request: api.fetchProfile,
    schema: profile
  });
