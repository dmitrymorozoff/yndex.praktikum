import { expect } from 'chai';
import { Router } from './router';
import LoginPage from '../pages/login/login';
import { Block } from '../baseClasses/Block';

export default function hello(name: string) {
  return `Hello ${name}`;
}

describe('Router navigation', () => {
  it('should check that new page changes History API entity', () => {
    const mockedRouter = new Router('.app');
    mockedRouter.use('/sign-up', new Block());
    mockedRouter.go('/sign-up');
    expect(window.history.length).equal(1);
  });
});
