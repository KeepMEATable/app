import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'WAITINGLINE_SHOW_ERROR':
      return action.error;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'WAITINGLINE_SHOW_LOADING':
      return action.loading;

    case 'WAITINGLINE_SHOW_RESET':
      return false;

    default:
      return state;
  }
}

export function init(state = null, action) {
 switch (action.type) {
   case 'APP_INIT_UID':
     return action.uid;
   default:
     return state;
 }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'WAITINGLINE_SHOW_SUCCESS':
      return action.retrieved;
    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, init });
