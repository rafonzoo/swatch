import CryptoJS from 'crypto-js';

export type SWStorage = {
  token?: string;
}

export const encryptor = (value: string|object, useExpired: boolean = false) => {
  const secret = process.env.SW_APP_SECRET_KEY;

  if (useExpired && typeof value === 'object') {
    const time = new Date(new Date()).getTime();

    value = {
      ...value,
      iat: time,
      exp: time + (3600 * 1000)
    };
  }

  value = typeof value === 'object' ? JSON.stringify(value) : value;
  const crypto = CryptoJS.AES.encrypt(value, secret || 's3cr3t');

  return crypto.toString();
};

export const decryptor = (token: string) => {
  const secret = process.env.SW_APP_SECRET_KEY;

  const crypto = CryptoJS.AES.decrypt(token, secret || 's3cr3t');
  const decrypt = crypto.toString(CryptoJS.enc.Utf8);

  try { return JSON.parse(decrypt); } catch (e) { return decrypt; }
};

export const storage = (): SWStorage => {
  const config = localStorage.getItem('sw-config');
  return (config && JSON.parse(config)) || false;
};

export const tokenize = () => {
  const { token } = storage();
  const result = {
    isExpired: false
  };

  if (token) {
    const { exp } = decryptor(token) as { exp: number };
    result.isExpired = new Date() > new Date(exp);
  }

  return result;
};

export const abortAuthorize = () => {
  return localStorage.removeItem('sw-config');
};

export const authorized = () => {
  const { token } = storage();

  if (token) {
    const { isExpired } = tokenize();

    if (isExpired) {
      abortAuthorize();

      return false;
    }

    return !isExpired;
  }

  return false;
};
