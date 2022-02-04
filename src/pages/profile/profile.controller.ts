import UserService from "../../services/userService";
import {User,UpdateUserInfo} from "./types";
import { snakeToCamelCase } from '../../utils/common';

export default class ProfileController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async getUserInfo() {
    const user = await this.userService.getUserInfo();
    return (snakeToCamelCase(user) as any);
  }

  async logOut() {
    await this.userService.logOut();
  }

  async updateUserData(userData: UpdateUserInfo) {
    const newUserData = await this.userService.updateUserData(userData);
    return (snakeToCamelCase(newUserData) as User);
  }
}
