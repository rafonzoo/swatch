import Joi from 'joi';
import Crypto from 'crypto-js';
import { storage } from 'Auth';

export interface SWUserAccount {
  email: string;
  username: string;
  password: string;
}

export interface SWUserProfile {
  firstName: string;
  lastName: string;
  nickName: string;
}

export interface SWUser {
  account: SWUserAccount;
  profile: SWUserProfile;
}

export interface SWUserCollection extends SWUser {
  id?: number;
  wishlists: [];
  orders: []
}

export const account: SWUserAccount = {
  email: '',
  username: '',
  password: ''
};

export const profile: SWUserProfile = {
  firstName: '',
  lastName: '',
  nickName: ''
};

export const guest: SWUserCollection = {
  account: {
    username: 'guest',
    email: 'example@email.com',
    password: 's3cr3t'
  },
  profile: {
    firstName: '',
    lastName: '',
    nickName: ''
  },
  wishlists: [],
  orders: []
};

export const collection: SWUserCollection = {
  account: {
    email: '',
    username: '',
    password: ''
  },
  profile: {
    firstName: '',
    lastName: '',
    nickName: ''
  },
  wishlists: [],
  orders: []
};

export const usertable = (table: Record<keyof SWUser, string[]>) => {
  const primaryKey: string = '++id';
  const arrayResult = [primaryKey];

  for (const key in table) {
    type UserTableKey = keyof Record<keyof SWUser, string[]>;

    const tabkey = table[key as UserTableKey];
    const arr = [];

    if (!tabkey) {
      continue;
    }

    for (let i = 0; i < tabkey.length; i++) {
      arr.push(`${key}.${tabkey[i]}`);
    }

    arrayResult.push(...arr);
  }

  return arrayResult.join(', ');
};

export const validate = <T extends SWUserAccount>(data: T): Joi.ValidationResult => {
  type SWUserValidator = SWUserAccount & {
    cPassword?: string;
  }

  const objectUser = Joi.object<SWUserValidator>({
    email: Joi.string().required().min(3),
    username: Joi.string().required().min(3),
    password: Joi.string().required().min(3),
    cPassword: Joi.ref('password')
  });

  return objectUser.validate(data);
};

export const currentUser = (): SWUserCollection => {
  const secret = process.env.SW_APP_SECRET_KEY;
  const { token } = storage();

  if (!token) {
    return guest;
  }

  const crypto = Crypto.AES.decrypt(token, secret || 's3cr3t');
  const decrypt = crypto.toString(Crypto.enc.Utf8);
  const { data }: { data: SWUserCollection } = JSON.parse(decrypt);

  return data;
};
