import { GenericObject } from '../global/types';

export function isObject(val: unknown): val is GenericObject {
  return (
    typeof val === 'object'
    && val != null
    && val.constructor === Object
    && Object.prototype.toString.call(val) === '[object Object]');
}

export function isArray(val: unknown): val is [] {
  return Array.isArray(val);
}

export function isError(x: any): x is Error {
  return x instanceof Error;
}
