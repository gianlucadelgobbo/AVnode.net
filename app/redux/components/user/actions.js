import * as api from "../../api";
import { user } from "./schema";
import { fetchModel as generateFetchModel } from "../../actions";
import * as selectors from "./selectors";
import * as constants from "./constants";

export const fetchModel = ({ id } = {}) =>
  generateFetchModel({
    selectors,
    constants,
    request: api.fetchUser,
    schema: user
  });
