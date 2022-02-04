import { Request } from '../utils/request';
import { GenericObject } from '../global/types';
import { UpdateUserInfo, RawUser } from '../pages/profile/types';
import { isError } from '../utils/typeGuards';

export default class UserService {
  request: Request;
  baseUrl: string;
  constructor() {
    this.request = new Request();
    this.baseUrl = 'https://ya-praktikum.tech/api/v2';
  }

  // todo: provide a concrete type here
  async signIn(userCredentials: GenericObject): Promise<XMLHttpRequest> {
    let xmlHTTPRequest: XMLHttpRequest | undefined;
    try {
      xmlHTTPRequest = await this.request.post(`${this.baseUrl}/auth/signIn`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data: userCredentials,
      });
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    if (!xmlHTTPRequest) {
      throw new Error('No resolved XMLHttpRequest');
    }
    return xmlHTTPRequest;
  }
  // todo: provide a concrete type here
  async signUp(userData: GenericObject): Promise<void> {
    try {
      this.request.post(`${this.baseUrl}/auth/signUp`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data: userData,
      });
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
  }

  async getUserInfo(): Promise<RawUser> {
    let user: RawUser | undefined;
    try {
      const res = await this.request.get(`${this.baseUrl}/auth/user`);
      user = JSON.parse(res.response);
    } catch (error) {
      // todo: create a component that will be popped up when an error occurs
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    if (!user) {
      throw new Error('User info was not retrieved');
    }
    return user;
  }

  async updateUserData(userData: UpdateUserInfo): Promise<RawUser> {
    let newUserData: RawUser | undefined;
    try {
      const res = await this.request.put(`${this.baseUrl}/user/profile`, {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        data: userData,
      });
      newUserData = JSON.parse(res.responseText);
    } catch (error) {
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
    if (!newUserData) {
      throw new Error('User data was not retrieved');
    }
    return newUserData;
  }

  async logOut(): Promise<void> {
    try {
      await this.request.post(`${this.baseUrl}/auth/logout`);
    } catch (error) {
      if (isError(error)) {
        throw new Error(error.message);
      }
    }
  }
}
