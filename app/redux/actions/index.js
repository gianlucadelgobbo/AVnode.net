import { normalize } from "normalizr";

// ==== List

export const fetchList = ({ constants, selectors, request, schema }) => (
  dispatch,
  getState
) => {
  if (selectors.getIsFetching(getState())) {
    return;
  }

  dispatch({
    type: constants.FETCH_LIST_REQUEST
  });

  return request().then(
    response => {
      dispatch({
        type: constants.FETCH_LIST_SUCCESS,
        response: normalize(response || [], schema)
      });
    },
    error => {
      const response = error.response || {};
      const data = response.data || {};
      const message = data.message || {};

      dispatch({
        type: constants.FETCH_LIST_ERROR,
        errorMessage: message || "Something went wrong."
      });
    }
  );
};

export const fetchEventList = ({ constants, selectors, request, schema }) => (
  dispatch,
  getState
) => {
  if (selectors.getIsFetching(getState())) {
    return;
  }

  dispatch({
    type: constants.FETCH_LIST_REQUEST
  });

  return request().then(
    response => {
      dispatch({
        type: constants.FETCH_LIST_SUCCESS,
        response: normalize(response || [], schema)
      });
    },
    error => {
      const response = error.response || {};
      const data = response.data || {};
      const message = data.message || {};

      dispatch({
        type: constants.FETCH_LIST_ERROR,
        errorMessage: message || "Something went wrong."
      });
    }
  );
};

export const fetchVideoList = ({ constants, selectors, request, schema }) => (
  dispatch,
  getState
) => {
  if (selectors.getIsFetching(getState())) {
    return;
  }

  dispatch({
    type: constants.FETCH_LIST_REQUEST
  });

  return request().then(
    response => {
      dispatch({
        type: constants.FETCH_LIST_SUCCESS,
        response: normalize(response || [], schema)
      });
    },
    error => {
      const response = error.response || {};
      const data = response.data || {};
      const message = data.message || {};

      dispatch({
        type: constants.FETCH_LIST_ERROR,
        errorMessage: message || "Something went wrong."
      });
    }
  );
};

// ==== Modal

export const fetchModel = ({
  constants,
  selectors,
  request,
  schema,
  id
} = {}) => (dispatch, getState) => {
  if (selectors.getModelIsFetching(getState(), id)) {
    return;
  }

  dispatch({
    type: constants.FETCH_MODEL_REQUEST,
    id
  });

  return request({ id }).then(
    response => {
      dispatch({
        type: constants.FETCH_MODEL_SUCCESS,
        response: normalize(response || [], schema),
        id
      });
      return { id };
    },
    error => {
      // scroll to top
      if ($ && typeof $.fn.scrollTop === "function") {
        $(window).scrollTop();
      }

      const response = error.response || {};
      const data = response.data || {};
      const message = data.message || {};

      dispatch({
        type: constants.FETCH_MODEL_ERROR,
        errorMessage: message || "Something went wrong.",
        id
      });
    }
  );
};

export const saveModel = ({ constants, selectors, request, schema, model }) => (
  dispatch,
  getState
) => {
  // if (selectors.getModelIsFetching(getState()), model.id) {
  //     return;
  // }

  dispatch({
    type: constants.SAVE_MODEL_REQUEST,
    id: model.id
  });

  return request(model).then(
    response => {
      dispatch({
        type: constants.SAVE_MODEL_SUCCESS,
        response: normalize(response || [], schema),
        id: model.id
      });

      return { model: response || "ok" };
    },
    error => {
      // scroll to top
      window.scrollTo(0, 0);

      const response = error.response || {};

      const data = response.data || {};
      const message = data.message || data.error || data.errors || {};

      dispatch({
        type: constants.SAVE_MODEL_ERROR,
        errorMessage: message || "Something went wrong.",
        id: model.id
      });
    }
  );
};

export const removeModel = ({
  constants,
  selectors,
  request,
  getIsFetching,
  schema,
  model
}) => (dispatch, getState) => {
  if (selectors.getModelIsFetching(getState(), model.id)) {
    return;
  }

  dispatch({
    type: constants.SAVE_MODEL_REQUEST,
    id: model.id
  });

  return request(model).then(
    response => {
      dispatch({
        type: constants.SAVE_MODEL_SUCCESS,
        response: normalize(response || [], schema),
        id: model.id
      });
      return { id: model.id };
    },
    error => {
      // scroll to top
      window.scrollTo(0, 0);

      const response = error.response || {};
      const data = response.data || {};
      const message = data.message || {};

      dispatch({
        type: constants.SAVE_MODEL_ERROR,
        errorMessage: message || "Something went wrong.",
        id: model.id
      });
    }
  );
};
