import {
  fetch,
  normalize,
  storeData, retrieveData, removeData
} from '../../utils/dataAccess';
import Fingerprint2 from "fingerprintjs2";
import {ENTRYPOINT} from "../../config/entrypoint";

export function error(error) {
  return { type: 'WAITINGLINE_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'WAITINGLINE_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'WAITINGLINE_SHOW_SUCCESS', retrieved };
}

export function authenticated(authenticated) {
  return { type: 'APP_AUTHENTICATED', authenticated };
}

export function logout() {
  removeData('authenticated');
  return { type: 'APP_LOGOUT' };
}

export function icu(uid) {
  return { type: 'APP_IDENTIFY', uid};
}

export function init() {
  return async dispatch => {
    dispatch(loading(true));
    await dispatch(authenticate());
    await dispatch(identify());
    await dispatch(getWaitingLine());
    dispatch(loading(false));
  }
}

export function updateStatus(newStatus, noLoop) {
  return async (dispatch, getState) => {
    let {show: {identity, authenticated: token}} = getState().waitingLine;

    let headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`);

    fetch(new URL(`/waiting_lines/${identity}/state`, ENTRYPOINT), {
      headers,
      method: 'PATCH',
      body: JSON.stringify({
        state: newStatus
      })
    }).then(response =>
      response
        .json()
        .then(retrieved => ({retrieved}))
    )
    .then(({retrieved}) => {
      retrieved = normalize(retrieved);

      dispatch(loading(false));
      dispatch(success(retrieved));
    })
    .catch(async (e) => {
      if (!noLoop) {
        dispatch(logout());
        await dispatch(authenticate(true));
        await dispatch(updateStatus(newStatus, true));
      }

      dispatch(error('cannot update the state.'));
    });
  }
}

export function authenticate(force = false) {
  return async (dispatch, getState) => {
    let {show: {authenticated: token}} = getState().waitingLine;

    if (token === null) {
      token = await retrieveData('authenticated');
    }

    if (!force && token !== null) {
      return dispatch(authenticated(token));
    }

    return fetch(new URL('/login_check', ENTRYPOINT), {
      method: 'POST',
      body: JSON.stringify({
        username: 'TheCustomer', // todo put this in env var.
        password: '!ChangeMe!'
      })
    }).then(response =>
        response
            .json()
            .then(authenticated => ({authenticated}))
    ).then(result => {
      storeData('authenticated', JSON.stringify(result.authenticated));
      return dispatch(authenticated(result.authenticated));
    }).catch(e => {
      dispatch(loading(false));
      dispatch(error(e.message));
    });
  }
}

export function identify() {
  return async dispatch => {
    dispatch(loading(true));

    const uid = await retrieveData('uid');

    if (uid !== null) {
      return dispatch(icu(uid));
    }

    return Fingerprint2.get((components) => {
      const uid = Fingerprint2.x64hash128(components.map((pair) => pair.value).join(), 31);
      storeData('uid', uid);

      return dispatch(icu(uid));
    });
  }
}

export function getWaitingLine(noLoop = false) {
  return (dispatch, getState) => {
    let {show: {identity, authenticated}} = getState().waitingLine;

    let headers = new Headers();
    headers.set('Authorization', `Bearer ${authenticated.token}`);

    return fetch(`/waiting_lines/${identity}`, {headers})
      .then(response =>
        response
          .json()
          .then(retrieved => ({retrieved}))
      )
      .then(({retrieved}) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));
      })
      .catch(async (e) => {
        // post uid before retry
        if (!noLoop) {
          dispatch(logout());
          await dispatch(authenticate(true));
          await dispatch(getWaitingLine(true));
        }

        dispatch(error('cannot retrieve data.'));
      });
  }
}
