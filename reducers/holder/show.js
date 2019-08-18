import { combineReducers } from 'redux';

export function error(state = null, action) {
  switch (action.type) {
    case 'HOLDER_SHOW_ERROR':
      return action.error;

    case 'HOLDER_SHOW_MERCURE_DELETED':
      return `${action.retrieved['@id']} has been deleted by another user.`;

    case 'HOLDER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export function loading(state = false, action) {
  switch (action.type) {
    case 'HOLDER_SHOW_LOADING':
      return action.loading;

    case 'HOLDER_SHOW_RESET':
      return false;

    default:
      return state;
  }
}

export function retrieved(state = null, action) {
  switch (action.type) {
    case 'HOLDER_SHOW_SUCCESS':
    case 'HOLDER_SHOW_MERCURE_MESSAGE':
      return action.retrieved;

    case 'HOLDER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export function eventSource(state = null, action) {
  switch (action.type) {
    case 'HOLDER_SHOW_MERCURE_OPEN':
      return action.eventSource;

    case 'HOLDER_SHOW_RESET':
      return null;

    default:
      return state;
  }
}

export default combineReducers({ error, loading, retrieved, eventSource });
