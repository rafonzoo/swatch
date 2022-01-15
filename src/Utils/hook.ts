
import type { SWUserCollection } from '@scheme/users';

import { useEffect, useRef } from 'react';
import { decryptor, storage, tokenize } from 'Auth';
import { guest } from '@scheme/users';

export const useUnload = (fn: () => void) => {
  const cb = useRef(fn);

  useEffect(() => {
    const onUnload = cb.current;

    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [cb]);
};

export const useResize = (fn: () => void) => {
  const cb = useRef(fn);

  useEffect(() => {
    const onUnload = cb.current;

    window.addEventListener('resize', onUnload);
    return () => {
      window.removeEventListener('resize', onUnload);
    };
  }, [cb]);
};

export const useScroll = (fn: () => void) => {
  const cb = useRef(fn);

  useEffect(() => {
    const onScroll = cb.current;

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [cb]);
};

export const useContentLoaded = (fn: () => void) => {
  const cb = useRef(fn);

  useEffect(() => {
    const onLoad = cb.current;

    document.addEventListener('DOMContentLoaded', onLoad);
    return () => {
      document.removeEventListener('DOMContentLoaded', onLoad);
    };
  }, [cb]);
};

export const useCustomer = () => {
  const { token } = storage();
  const { isExpired } = tokenize();

  if (!token || isExpired) return guest;

  const { data } = decryptor(token) as { data: SWUserCollection };
  return data || guest;
};
