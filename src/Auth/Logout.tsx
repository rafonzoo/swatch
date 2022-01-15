import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { authorized, abortAuthorize } from '.';

function Logout ({ setAuth }: { setAuth(state: boolean): void }) {
  useEffect(() => {
    if (authorized()) {
      abortAuthorize();
      setAuth(false);
    }
  });

  return <Navigate replace to='/' />;
}

export default Logout;
