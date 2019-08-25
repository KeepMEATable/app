import { ENTRYPOINT } from '../config/entrypoint';
import { SubmissionError } from 'redux-form';
import {AsyncStorage} from 'react-native';
import get from 'lodash/get';
import has from 'lodash/has';
import mapValues from 'lodash/mapValues';

const MIME_TYPE = 'application/ld+json';

export async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(`@kmat:${key}`, value);
  } catch (error) {
    // Error saving data
  }
}

export async function removeData(key) {
  await AsyncStorage.removeItem(`@kmat:${key}`);
}

export async function retrieveData(key)
{
  try {
    const item = await AsyncStorage.getItem(`@kmat:${key}`);
    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  } catch (error) {
    throw Error(error);
  }
}

export function fetch(id, options = {}) {
  if ('undefined' === typeof options.headers) options.headers = new Headers();
  if (null === options.headers.get('Accept')) options.headers.set('Accept', MIME_TYPE);

  if (
    'undefined' !== options.body &&
    !(options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  )
    options.headers.set('Content-Type', MIME_TYPE);

  return global.fetch(new URL(id, ENTRYPOINT), options).then(response => {
    if (response.ok) return response;

    return response.json().then(json => {
      const error = json['hydra:description'] || response.statusText;
      if (!json.violations) throw Error(error);

      let errors = { _error: error };
      json.violations.map(
        violation => (errors[violation.propertyPath] = violation.message)
      );

      throw new SubmissionError(errors);
    });
  });
}

export function normalize(data) {
  if (has(data, 'hydra:member')) {
    // Normalize items in collections
    data['hydra:member'] = data['hydra:member'].map(item => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, value =>
    Array.isArray(value)
      ? value.map(v => get(v, '@id', v))
      : get(value, '@id', value)
  );
}
