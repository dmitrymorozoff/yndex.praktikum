export type GenericObject<T = unknown> = {
  [key in string]: T
}

export type CallBack = (...args: any) => void;
export interface Form extends HTMLCollectionOf<HTMLFormElement>{
  loginForm: HTMLFormElement,
  registrationForm: HTMLFormElement,
  profileForm: HTMLFormElement,
  conversationForm: HTMLFormElement,
}

export enum USER_LOGIN_STATUS {
  IS_LOGGED = 'OK'
}
