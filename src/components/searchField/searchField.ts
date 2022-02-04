import notCompiledTemplate from './searchField.tmpl';
import './searchField.less';
import { Block } from '../../baseClasses/Block';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';

const Handlebars = require('handlebars');

export class SearchField extends Block {
  constructor() {
    super('div');
  }

  render() {
    const rh = new RenderHelpers();
    const template = Handlebars.compile(notCompiledTemplate);
    const templateHTML = template({});
    return rh.convertHTMLToDOM(templateHTML);
  }
}
