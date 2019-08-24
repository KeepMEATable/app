import {
  fetch,
  normalize,
} from '../../utils/dataAccess';
import Fingerprint2 from "fingerprintjs2";

export function error(error) {
  return { type: 'WAITINGLINE_SHOW_ERROR', error };
}

export function loading(loading) {
  return { type: 'WAITINGLINE_SHOW_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'WAITINGLINE_SHOW_SUCCESS', retrieved };
}

export function icu(uid) {
  return { type: 'APP_INIT_UID', uid};
}

export function getUid() {
  return dispatch => {
    dispatch(loading(true));

    return Fingerprint2.get((components) => {
      dispatch(icu(Fingerprint2.x64hash128(components.map((pair) => pair.value).join(), 31)));
      dispatch(loading(false));
    });
  }
}

export function retrieve(id) {
  return dispatch => {
    dispatch(loading(true));

    return fetch(id)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved }))
      )
      .then(({ retrieved }) => {
        retrieved = normalize(retrieved);

        dispatch(loading(false));
        dispatch(success(retrieved));
      })
      .catch(e => {
        // post uid before retry
        dispatch(loading(false));
        dispatch(error(e.message));
      });
  };
}
