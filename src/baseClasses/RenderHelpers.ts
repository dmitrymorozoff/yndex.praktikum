import { GenericObject } from '../global/types'
import { Block } from './Block'

const Handlebars = require('handlebars');

export class RenderHelpers {
  generateView(notCompiledTemplate: string, content?: GenericObject) {
    const template = Handlebars.compile(notCompiledTemplate);
    if (content) {
      const templateContent = Object.entries(content).reduce((res: GenericObject, [k, v]) => {
        res[k] = v;
        return res;
      }, {});
      return template(templateContent);
    }
    return template({});
  }

  registerPartial(partialName: any, partialTemplate: any) {
    return Handlebars.registerPartial(partialName, partialTemplate);
  }

  convertHTMLToDOM(htmlString: string) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content;
  }

  convertDOMToHTML(domEl: DocumentFragment) {
    const div = document.createElement('div');
    div.appendChild(domEl.cloneNode(true));
    return div.innerHTML;
  }

  replaceElementsInHTMLTemplate(templateHTML: string, elementsWithId: Block[]) {
    const templateDOM = this.convertHTMLToDOM(templateHTML);
    elementsWithId.forEach((elementWithId) => {
      const oldEl = templateDOM.querySelector(`[data-id='${elementWithId.getId()}']`);
      const newEl = elementWithId.getElement();
      const parent = oldEl?.parentElement;
      if (parent && oldEl) {
        parent.replaceChild(newEl, oldEl);
      }
    });
    return templateDOM;
  }
}
