import { Block } from '../baseClasses/Block';
import { areStringsEqual } from './isEqual';
import { render } from './common';

type PropsType = { rootQuery?: string }

class Route {
  private _pathname: string;
  private _blockClass: Block;
  private _block: null | Block;
  private _props: PropsType;

  constructor(pathname: string, view: Block, props: PropsType) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  match(pathname: string) {
    return areStringsEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = this._blockClass;
    }
    render(this._block, this._props.rootQuery);
  }
}

export class Router {
  private _rootQuery?: string;
  routes: Route[];
  history: History;
  private static __instance: Router;
  constructor(rootQuery?: string) {
    if (Router.__instance) {
      return Router.__instance;
    }
    this.routes = [];
    this.history = window.history;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: Block) {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start() {
    window.onpopstate = (event: Event) => {
      const { currentTarget } = event;
      if (currentTarget) this._onRoute((currentTarget as Window).location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, `${pathname}`, pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}
