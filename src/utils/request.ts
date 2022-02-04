import { queryStringify } from './queryString';
import { GenericObject } from '../global/types';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

type Options = {
  headers: Record<string, string>,
  data?: GenericObject,
  method: string,
  withCredentials: boolean
}

export class Request {
  get(url: string, options?: GenericObject, timeout?: number) {
    return this.request(url, { ...options, method: METHODS.GET }, timeout);
  }
  put(url: string, options?: GenericObject, timeout?: number) {
    return this.request(url, { ...options, method: METHODS.PUT }, timeout);
  }
  post(url: string, options?: GenericObject, timeout?: number) {
    return this.request(url, { ...options, method: METHODS.POST }, timeout);
  }
  delete(url: string, options?: GenericObject, timeout?: number) {
    return this.request(url, { ...options, method: METHODS.DELETE }, timeout);
  }

  request = (url: string, options: GenericObject, timeout = 5000): Promise<XMLHttpRequest> => {
    const {
      headers = {}, data, method,
    } = options as Options;
    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('No method provided for XHR'));
      }
      const xhr = new XMLHttpRequest();
      if (method === METHODS.GET && data) {
        const urlForGet = url + queryStringify(data);
        xhr.open(method, urlForGet);
      } else {
        xhr.open(method, url);
      }
      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });
      xhr.timeout = timeout;
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;
      xhr.onload = () => {
        const { status } = xhr;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          resolve(xhr);
        } else {
          const parsedError = JSON.parse(xhr.response);
          reject(new Error(`Failed to request data: ${xhr.status} ${parsedError.statusText} ${parsedError.reason}`));
        }
      };
      if (method === METHODS.GET) {
        xhr.send();
      } else {
        xhr.send(queryStringify(data || {}));
      }
    });
  }
}
