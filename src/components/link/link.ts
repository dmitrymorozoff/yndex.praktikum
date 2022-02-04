import notCompiledTemplate from './link.tmpl';
import './link.less';
import { Block } from '../../baseClasses/Block';
import { CallBack } from '../../global/types';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';

const Handlebars = require('handlebars');

type LinkProps = {
  linkText: string,
  linkStyle: string,
  events?: { [key: string]: CallBack },
}

export class Link extends Block {
  constructor(props: LinkProps) {
    super('div', props);
  }

  render() {
    const rh = new RenderHelpers();
    const template = Handlebars.compile(notCompiledTemplate);
    const templateHTML = template({
      linkStyle: this.props.linkStyle,
      linkText: this.props.linkText,
    });
    return rh.convertHTMLToDOM(templateHTML);
  }
}
