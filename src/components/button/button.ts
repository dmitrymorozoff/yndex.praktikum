import notRenderedTemplate from './button.tmpl';
import './button.less';
import { Block } from '../../baseClasses/Block';
import { CallBack } from '../../global/types';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';

const Handlebars = require('handlebars');

type ButtonProps = {
  buttonText?: string,
  buttonStyle: string,
  events?: { [key: string]: CallBack },
}

export class Button extends Block {
  rh: RenderHelpers;
  constructor(props:ButtonProps) {
    super('div', props);
  }

  render() {
    const rh = new RenderHelpers();
    const template = Handlebars.compile(notRenderedTemplate);
    const templateHTML = template({
      buttonStyle: this.props.buttonStyle,
      buttonText: this.props.buttonText ?? null,
    });
    return rh.convertHTMLToDOM(templateHTML);
  }
}
