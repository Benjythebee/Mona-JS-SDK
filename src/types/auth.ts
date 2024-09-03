import { MissingParam } from './common';

export type OTPMIssingError = {
  detail: MissingParam[];
};

export type InvalidBearerToken = {
  detail: string;
  code: string;
  messages: {
    token_class: string;
    token_type: string;
    message: string;
  }[];
};

export type MonaUser = {
  wallets: string[];
  email: string;
  username: string;
  name: string;
};
