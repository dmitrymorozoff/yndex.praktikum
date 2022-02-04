import EventBus from './EventBus';
import { RenderHelpers } from './RenderHelpers';
import {v4 as makeUUID} from 'uuid';

type allowedTags = 'div' | 'button';
export class Block {
  private _element: HTMLElement;
  private _meta: { props: any, tagName: allowedTags };
  props: any;
  eventBus: () => EventBus;
  static eventBus: () => EventBus;
  private _id: string;
  isFullPageHeight: boolean;
  isFullPageWidth: boolean;
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  }
  rh: RenderHelpers;

  constructor(tagName: allowedTags = 'div', props = {}, isFullPageHeight = false, isFullPageWidth = false) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props,
    };
    this._id = makeUUID();
    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    this.isFullPageHeight = isFullPageHeight;
    this.isFullPageWidth = isFullPageWidth;
    this.rh = new RenderHelpers();
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    element.setAttribute('data-id', this._id);
    // todo: refactor and remove this part, it's not correct to assign styles here
    if (this.isFullPageHeight) {
      element.style.height = '100%';
    }
    if (this.isFullPageWidth) {
      element.style.width = '100%';
    }
    return element;
  }

  setProps = (nextProps: any) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  private async _componentDidMount() {
    await this.componentDidMount();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  componentDidMount() {}

  private async _componentDidUpdate() {
    await this.componentDidUpdate();
    this._render();
  }

  getElement() {
    return this._element;
  }

  componentDidUpdate() {}

  getId() {
    return this._id;
  }

  private _addEvents() {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element.addEventListener(
        eventName,
        events[eventName],
      );
    });
  }

  private _render() {
    const block = this.render();
    this._element.innerHTML = '';
    //  todo this.removeListneres()
    this._element.appendChild(block);
    this._addEvents();
  }

  renderAsHTMLString() {
    // this method is needed when we work with html templates in handlebars partials
    return this._element.outerHTML;
  }

  render(): Node {
    return document.createElement('div');
  }

  forceRender() {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _makePropsProxy(props: any) {
    function errorWhenPrivateProp(prop: string | number | symbol) {
      if (typeof prop === 'string' && prop.indexOf('_') === 0) {
        throw new Error('Нет прав');
      }
    }

    const self = this;

    return new Proxy(props, {
      get: (target, prop) => {
        errorWhenPrivateProp(prop);
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) {
        errorWhenPrivateProp(prop);
        target[prop] = value;
        self.eventBus().emit('flow:component-did-update');
        return true;
      },
      deleteProperty: () => {
        throw new Error('Нет прав');
      },
    });
  }
}
