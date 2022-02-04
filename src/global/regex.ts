export const loginRule = {
  regex: /^(?=[\S]+)(?=.*[^0-9 ].*)[a-zA-Z0-9_-]{3,20}$/,
  validationMessage: 'Login should be 3 to 20 symbols and not include special symbols exept for _ or -',
};

export const passwordRule = {
  regex: /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d]{8,40}$/,
  validationMessage: 'Please provide a password of length from 8 to 40 with at least 1 capital letter and 1 digit',
};

export const emailRule = {
  regex: /^\S+@\S+\.\S+$/,
  validationMessage: 'Please provide a correct email',
};

export const nameRule = {
  regex: /^(?=[\S])[A-Z]{1}[A-Za-z-]*$/,
  validationMessage: 'Name should start with a capital letter, no spaces or digits allowed',
};

export const surnameRule = {
  regex: /^(?=[\S])[A-Z]{1}[A-Za-z-]*$/,
  validationMessage: 'Name should start with a capital letter, no spaces or digits allowed',
};

export const phoneRule = {
  regex: /^\+?[\d]{10,15}$/,
  validationMessage: 'Please provide a correct phone number',
};

export const noEmptyStringRule = {
  regex: /^.*\S.*$$/,
  validationMessage: 'Message cannot be empty',
};
