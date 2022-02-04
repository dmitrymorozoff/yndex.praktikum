import notCompiledTemplate from './text.tmpl';
import './text.less';
import { Block } from '../../baseClasses/Block';
import { CallBack } from '../../global/types';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';

const Handlebars = require('handlebars');

type TextProps = {
  text: string,
  textStyle: string,
  events?: { [key: string]: CallBack },
}

export class Text extends Block {
  constructor(props: TextProps) {
    super('div', props);
  }

  render() {
    const rh = new RenderHelpers();
    const template = Handlebars.compile(notCompiledTemplate);
    const templateHTML = template({
      text: this.props.text,
      textStyle: this.props.textStyle,
    });
    return rh.convertHTMLToDOM(templateHTML);
  }
}
