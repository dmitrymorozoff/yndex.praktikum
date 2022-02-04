import { GenericObject } from '../global/types';
import { isObject, isArray } from './typeGuards';

function stringifyArray(key: string, arr: []): string {
  let res = '';
  arr.forEach((el, ind) => {
    res += `${key}[${ind}]=${el}&`;
  });
  return removeLastChar(res);
}

function removeLastChar(s: string): string {
  return s.substring(0, s.length - 1);
}

function stringifyObjectDeep(obj: GenericObject): string {
  let res = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, val] of Object.entries(obj)) {
    if (isObject(val)) {
      res += `[${key}]${stringifyObjectDeep(val)}&`;
    } else if (isArray(val)) {
      res += `${stringifyArray(key, val)}&`;
    } else {
      res += `[${key}]=${encodeURIComponent(String(val))}&`;
    }
  }
  return removeLastChar(res);
}

export function queryStringify(data: GenericObject): string | never {
  if (!isObject(data)) {
    throw new Error('input must be an object.');
  }
  let res = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, val] of Object.entries(data)) {
    if (typeof val === 'undefined') {
      // eslint-disable-next-line no-continue
      continue;
    } else if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
      res += `${key}=${encodeURIComponent(String(val))}&`;
    } else if (isObject(val)) {
      res += `${key}${stringifyObjectDeep(val)}&`;
    } else if (isArray(val)) {
      res += `${stringifyArray(key, val)}&`;
    }
  }
  return removeLastChar(res);
}
