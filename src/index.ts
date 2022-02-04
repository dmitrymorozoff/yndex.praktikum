import { Router } from './utils/router';
import { LoginPage } from './pages/login/index';
import { RegistrationPage } from './pages/registration/index';
import { ChatsPage } from './pages/chats/index';
import { ProfilePage } from './pages/profile/index';
import { ErrorPage } from './pages/error/index';

const router = new Router('.app');

router
  .use('/', new LoginPage())
  .use('/sign-up', new RegistrationPage())
  .use('/settings', new ProfilePage())
  .use('/messenger', new ChatsPage())
  .use('/404', new ErrorPage({ errorCode: 404, desc: 'Sorry, but this page does not exist' }))
  .use('/500', new ErrorPage({ errorCode: 500, desc: 'We are working to fix the problem!' }))
  .start();
