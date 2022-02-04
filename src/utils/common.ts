import { GenericObject } from '../global/types';
import { Block } from '../baseClasses/Block';
import { isObject } from './typeGuards';

const snakeToCamel = (s: string) => s.replace(/(_\w)/g, (k) => k[1].toUpperCase());

export function snakeToCamelCase(obj: GenericObject) {
  const res: GenericObject = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (isObject(val)) {
      res[snakeToCamel(key)] = snakeToCamelCase(val);
    } else {
      res[snakeToCamel(key)] = val;
    }
  });
  return res;
}

export function getFormData(form: HTMLFormElement) {
  const formData: FormData = new FormData(form);
  const formDataToDisplay = [...formData.entries()].reduce((prev: GenericObject, [k, v]) => {
    prev[k] = v;
    return prev;
  }, {});
    // eslint-disable-next-line no-console
  console.log(formDataToDisplay);
  return formDataToDisplay;
}

export function render(block: Block, query?: string) {
  if (query) {
    const root = document.querySelector(query);
    if (root) {
      root.innerHTML = '';
      root.appendChild(block.getElement());
    }
  }
}
