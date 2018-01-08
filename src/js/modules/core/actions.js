import * as t from "./actionTypes";

export const refreshWindowDimensions = () => ({
  type: t.REFRESH_WINDOW_DIMENSIONS,
  payload: {}
});

export const createSession = (uid) => ({
  type: t.CREATE_SESSION,
  payload: uid
})

export const deleteSession = () => ({
  type: t.DELETE_SESSION
})