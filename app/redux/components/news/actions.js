import * as api from "../../api";
import { arrayOfNews, news } from "./schema";
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
    schema: arrayOfNews,
    request: api.fetchNews
  });

export const removeModel = ({ id }) => () =>
  generateRemoveModel({
    selectors,
    constants,
    schema: news,
    request: api.removeNews,
    id
  });

export const saveModel = model =>
  generateSaveModel({
    selectors,
    constants,
    schema: news,
    request: api.postNews,
    model
  });
