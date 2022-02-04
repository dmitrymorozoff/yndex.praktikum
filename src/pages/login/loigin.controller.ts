import UserService from '../../services/userService';
import { GenericObject, USER_LOGIN_STATUS } from '../../global/types';

export class LoginController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async isUserSigned(userCredentials: GenericObject): Promise<boolean> {
    const res = await this.userService.signIn(userCredentials);
    return res.responseText === USER_LOGIN_STATUS.IS_LOGGED;
  }
}
