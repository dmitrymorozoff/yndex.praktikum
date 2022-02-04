import notCompiledTemplate from './error.tmpl';
import './error.less';
import { Block } from '../../baseClasses/Block';
import { RenderHelpers } from '../../baseClasses/RenderHelpers';
import { Link } from '../../components/link/index';
import { Router } from '../../utils/router';

type ErrorPageProps = {
  errorCode: number,
  desc: string
}

export default class ErrorPage extends Block {
  errorCode: number;
  desc: string;
  rh: RenderHelpers;
  linkToChats: any;
  router: Router;
  constructor(props: ErrorPageProps) {
    super('div', props, true);
    this.router = new Router();
  }

  componentDidMount() {
    this.linkToChats = new Link({
      linkText: 'Back to chats',
      linkStyle: 'errorPageContainer__navToChats',
      events: {
        click: this.onClickLinkToChats.bind(this),
      },
    });
  }

  onClickLinkToChats() {
    this.router.go('/messenger');
  }

  render() {
    this.rh.registerPartial('linkToChats', this.linkToChats.renderAsHTMLString());
    const templateHTML = this.rh.generateView(notCompiledTemplate,
      {
        errorCode: this.props.errorCode,
        errorDescription: this.props.desc,
      });
    return this.rh.replaceElementsInHTMLTemplate(templateHTML,
      [this.linkToChats],
    );
  }
}
